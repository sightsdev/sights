#!/usr/bin/env python3
import websockets
import asyncio
import os
import json
import math
import atexit
import logging
from motors import Motors
from websocket_process import WebSocketProcess

class ControlReceiver (WebSocketProcess):
    def __init__(self, mpid, pipe, config_file):
        WebSocketProcess.__init__(self, mpid, pipe, config_file, 5555)
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # Create Motors to handle servos
        self.motors = Motors(self.config)
        # When script exits or is interrupted stop all servos
        atexit.register(self.motors.close)
        # Controller state object
        self.state = {
            "LEFT_STICK_X": 0.0,
            "LEFT_STICK_Y": 0.0,
            "LEFT_BOTTOM_SHOULDER": 0.0,
            "RIGHT_BOTTOM_SHOULDER": 0.0,
            "LEFT_TOP_SHOULDER": False,
            "RIGHT_TOP_SHOULDER": False
        }

    def gamepad_movement_handler(self, type="TRIGGER"):
        if (type == "TRIGGER"):
            left = self.state["LEFT_BOTTOM_SHOULDER"] * self.motors.gamepad_speed
            right = self.state["RIGHT_BOTTOM_SHOULDER"] * self.motors.gamepad_speed

            # If modifier pressed, than invert value
            left *= (-1) ** self.state["LEFT_TOP_SHOULDER"]
            right *= (-1) ** self.state["RIGHT_TOP_SHOULDER"]

            # Send command to servo handler, independent flag allows the two sides to operate independently
            self.motors.move(left, right, independent=True)
        else:
            x = self.state["LEFT_STICK_X"] * -1
            y = self.state["LEFT_STICK_Y"] * -1
            # convert to polar
            r = math.hypot(y, x)
            t = math.atan2(x, y)
            # rotate by 45 degrees
            t += math.pi / 4
            # back to cartesian
            left = r * math.cos(t)
            right = r * math.sin(t)
            # rescale the new coords
            left *= math.sqrt(2)
            right *= math.sqrt(2)
            # clamp to -1/+1
            left = max(-1, min(left, 1))
            right = max(-1, min(right, 1))
            # Multiply by gamepad_speed to get our final speed to be sent to the servos
            left *= self.motors.gamepad_speed
            right *= self.motors.gamepad_speed
            # Send command to servos
            self.motors.move(left, right)


    def keyboard_handler(self, control, value):
        speed = self.motors.keyboard_speed
        if (control == "FORWARD"):
            if value == "UP":
                self.motors.move(0, 0)
            else:
                self.motors.move(speed, speed)
        elif (control == "BACKWARDS"):
            if value == "UP":
                self.motors.move(0, 0)
            else:
                self.motors.move(-speed, -speed)
        elif (control == "LEFT"):
            if value == "UP":
                self.motors.move(0, 0)
            else:
                self.motors.move(-speed, speed)
        elif (control == "RIGHT"):
            if value == "UP":
                self.motors.move(0, 0)
            else:
                self.motors.move(speed, -speed)
        elif (control == "SPEED_UP"):
            if value == "DOWN":
                self.motors.keyboard_speed = min(1023, speed + 128)
                self.pipe.send(["SYNC_SPEED", "kb", self.motors.keyboard_speed])
        elif (control == "SPEED_DOWN"):
            if value == "DOWN":
                self.motors.keyboard_speed = max(127, speed - 128)
                self.pipe.send(["SYNC_SPEED", "kb", self.motors.keyboard_speed])

    def save_config(self, cfg, filename):
        # Rolling backups
        backup_dir = "src/configs/sights/backup/"
        # Use current config name if no new name is provided
        name = os.path.basename(self.config_file) if filename == "" else filename
        config_path = os.path.dirname(self.config_file) + "/" + name

        if os.path.exists(config_path):
            # File exists
            # Find existing backups for this config file
            for file in sorted(os.listdir(backup_dir), reverse=True):
                if file.startswith(f"{name}.backup."):
                    # Get backup ID
                    id = int(file[-1])
                    # Remove oldest backup
                    if id == 5:
                        os.remove(backup_dir + file)
                    else:
                        # Add 1 to the rest of the backup IDs
                        new_id = str(id + 1)
                        os.rename(backup_dir + file, backup_dir + name + ".backup." + new_id)
            # Save the previous config as a new backup
            os.rename(config_path, backup_dir + name + ".backup.0")

            # Save new config to file
            with open(config_path, 'w') as f:
                f.write(cfg)
            self.logger.info("Saved existing configuration file " + config_path)
        else:
            # File does not exist, save new config to file
            with open(config_path, 'w') as f:
                f.write(cfg)
            self.logger.info("Saved new configuration file " + config_path)


    def message_handler(self, buf):
        # Load object from JSON
        msg = json.loads(buf)

        typ = msg["type"]  # system, axis, button
        control = msg["control"]  # FACE_0, LEFT_STICK_Y, etc.

        if (typ == "SYSTEM"):
            # Handle power commands
            if (control == "SHUTDOWN"):
                self.logger.info("Received shutdown signal, shutting down...")
                os.system('poweroff')
            elif (control == "REBOOT"):
                self.logger.info("Received reboot signal, rebooting...")
                os.system('reboot')
            # Handle configuration requests
            elif (control == "SAVE_CONFIG"):
                self.logger.info("Received new configuration file")
                self.save_config(msg["value"][0], msg["value"][1])
            elif (control == "REQUEST_CONFIG"):
                self.logger.info("Received request for configuration file")
                # Send a message to sensor_stream requesting that they send the config file again
                self.pipe.send(["REQUEST_CONFIG"])
        elif (typ == "KEYBOARD"):
            value = msg["value"]  # UP, DOWN
            # Handle directional movement etc
            self.keyboard_handler(control, value)
        elif (typ == "BUTTON"):
            value = msg["value"]  # UP, DOWN
            # Store in state, because it might be useful (e.g. for modifiers)
            self.state[control] = True if value == "DOWN" else False
            # 
            if (control == "LEFT_TOP_SHOULDER" or control == "RIGHT_TOP_SHOULDER"):
                self.gamepad_movement_handler(type="TRIGGER")
            # Then handle any button events
            if (control == "DPAD_UP"):
                if value == "DOWN":
                    self.motors.gamepad_speed = min(1023, self.motors.gamepad_speed + 128)
                    self.pipe.send(["SYNC_SPEED", "gp", self.motors.gamepad_speed])
            elif (control == "DPAD_DOWN"):
                if value == "DOWN":
                    self.motors.gamepad_speed = max(127, self.motors.gamepad_speed - 128)
                    self.pipe.send(["SYNC_SPEED", "gp", self.motors.gamepad_speed])
        elif (typ == "AXIS"):
            # If axis, store as float
            value = float(msg["value"])
            # Update state with new value of axis
            self.state[control] = value
            # Handle trigger and stick controls
            if (control == "LEFT_STICK_X" or control == "LEFT_STICK_Y"):
                self.gamepad_movement_handler(type="STICK")
            else:
                self.gamepad_movement_handler(type="TRIGGER")
            

    async def main(self, websocket, path):
        # Enter runtime loop
        while True:
            # Recieve JSON formatted string from websockets
            try:
                buf = await websocket.recv()
            except websockets.exceptions.ConnectionClosed:
                self.logger.info("Control server connection lost")
                break
            if len(buf) > 0:
                if self.config['debug']['print_messages']:
                    self.logger.info(buf)
                # Convert string data to object and then handle controls
                self.message_handler(buf)
