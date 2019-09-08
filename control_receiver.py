#!/usr/bin/env python3
import websockets
import asyncio
import os
import json
import math
import atexit
from servo_party import ServoParty
from websocketprocess import WebSocketProcess

class ControlReceiver (WebSocketProcess):
    def __init__(self, mpid, pipe):
        WebSocketProcess.__init__(self, mpid, pipe, 5555)
        # Load config file
        self.config = json.load(open('robot.json'))
        # Create ServoParty to handle servos
        self.servo_party = ServoParty(self.config)
        # When script exits or is interrupted stop all servos
        atexit.register(self.servo_party.close)
        # Controller state object
        self.state = {
            "LEFT_STICK_X": 0.0,
            "LEFT_STICK_Y": 0.0,
            "LEFT_BOTTOM_SHOULDER": 0.0,
            "RIGHT_BOTTOM_SHOULDER": 0.0,
            "LEFT_TOP_SHOULDER": False,
            "RIGHT_TOP_SHOULDER": False
        }

    def gamepad_movement_handler(self):
        if (self.state["LEFT_BOTTOM_SHOULDER"] != 0 or self.state["RIGHT_BOTTOM_SHOULDER"] != 0):
            left = self.state["LEFT_BOTTOM_SHOULDER"] * self.servo_party.gamepad_speed
            right = self.state["RIGHT_BOTTOM_SHOULDER"] * self.servo_party.gamepad_speed

            # If modifier pressed, than invert value
            left *= (-1) ** self.state["LEFT_TOP_SHOULDER"]
            right *= (-1) ** self.state["RIGHT_TOP_SHOULDER"]

            # Send command to servo handler, independent flag allows the two sides to operate independently
            self.servo_party.move(left, right, independent=True)
        else:
            x = state["LEFT_STICK_X"] * -1
            y = state["LEFT_STICK_Y"] * -1

            # convert to polar
            r = math.hypot(y, x)
            t = math.atan2(x, y)

            # rotate by 45 degrees
            t += math.pi / 4

            # back to cartesian
            left = r * math.cos(t)
            right = r * math.sin(t)

            # rescale the new coords
            left = left * math.sqrt(2)
            right = right * math.sqrt(2)

            # clamp to -1/+1
            left = max(-1, min(left, 1))
            right = max(-1, min(right, 1))

            # Multiply by gamepad_speed to get our final speed to be sent to the servos
            left *= self.servo_party.gamepad_speed
            right *= self.servo_party.gamepad_speed

            # Send command to servos
            self.servo_party.move(left, right)


    def keyboard_handler(self, control, value):
        speed = self.servo_party.keyboard_speed
        if (control == "FORWARD"):
            if value == "UP":
                self.servo_party.move(0, 0)
            else:
                self.servo_party.move(speed, speed)
        elif (control == "BACKWARDS"):
            if value == "UP":
                self.servo_party.move(0, 0)
            else:
                self.servo_party.move(-speed, -speed)
        elif (control == "LEFT"):
            if value == "UP":
                self.servo_party.move(0, 0)
            else:
                self.servo_party.move(-speed, speed)
        elif (control == "RIGHT"):
            if value == "UP":
                self.servo_party.move(0, 0)
            else:
                self.servo_party.move(speed, -speed)
        elif (control == "SPEED_UP"):
            if value == "DOWN":
                self.servo_party.keyboard_speed = min(1024, speed + 128)
                self.pipe.send(["SYNC_SPEED", "kb", self.servo_party.keyboard_speed])
        elif (control == "SPEED_DOWN"):
            if value == "DOWN":
                self.servo_party.keyboard_speed = max(128, speed - 128)
                self.pipe.send(["SYNC_SPEED", "kb", self.servo_party.keyboard_speed])

    def save_config(self, cfg):
        # Save new config to file
        with open('robot.json', 'w') as f:
            f.write(cfg)
        # Reload config 
        self.config = json.load(open('robot.json'))

    def message_handler(self, buf):
        # Load object from JSON
        msg = json.loads(buf)

        typ = msg["type"]  # system, axis, button
        control = msg["control"]  # FACE_0, LEFT_STICK_Y, etc.

        if (typ == "AXIS"):
            # If axis, store as float
            value = float(msg["value"])
            # Update state with new value of axis
            self.state[control] = value
            # Handle trigger and stick controls
            self.gamepad_movement_handler()
        elif (typ == "SYSTEM"):
            # Handle power commands
            if (control == "SHUTDOWN"):
                print("RECEIVER: Received shutdown signal, shutting down...")
                os.system('poweroff')
            elif (control == "REBOOT"):
                print("RECEIVER: Received reboot signal, rebooting...")
                os.system('restart')
            # Handle configuration requests
            elif (control == "UPDATE_CONFIG"):
                print("RECEIVER: Received new configuration file")
                self.save_config(msg["value"])
            elif (control == "REQUEST_CONFIG"):
                print("RECEIVER: Received request for configuration file")
                # Send a message to sensor_stream requesting that they send the config file again
                self.pipe.send(["REQUEST_CONFIG"])
            elif (control == "RESTART_SCRIPTS"):
                print("RECEIVER: Received request to restart scripts")
                # Send a message to manager requesting a script restart
                self.manager_pipe.send(["RESTART_SCRIPTS"])
        elif (typ == "KEYBOARD"):
            value = msg["value"]  # UP, DOWN
            # Handle directional movement etc
            self.keyboard_handler(control, value)
        elif (typ == "BUTTON"):
            value = msg["value"]  # UP, DOWN
            # Store in state, because it might be useful (e.g. for modifiers)
            self.state[control] = True if value == "DOWN" else False
            # Then handle any button events
            if (control == "DPAD_UP"):
                if value == "DOWN":
                    self.servo_party.gamepad_speed = min(1024, self.servo_party.gamepad_speed + 128)
                    self.pipe.send(["SYNC_SPEED", "gp", self.servo_party.gamepad_speed])
            elif (control == "DPAD_DOWN"):
                if value == "DOWN":
                    self.servo_party.gamepad_speed = max(128, self.servo_party.gamepad_speed - 128)
                    self.pipe.send(["SYNC_SPEED", "gp", self.servo_party.gamepad_speed])


    async def main(self, websocket, path):
        # Enter runtime loop
        while True:
            # Recieve JSON formatted string from websockets
            try:
                buf = await websocket.recv()
            except websockets.exceptions.ConnectionClosed:
                print("RECEIVER: Control server connection lost")
                break
            if len(buf) > 0:
                if self.config['debug']['print_messages']:
                    print(buf)
                # Convert string data to object and then handle controls
                self.message_handler(buf)