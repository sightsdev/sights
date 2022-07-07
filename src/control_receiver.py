#!/usr/bin/env python3
from motor_handler import MotorHandler
from websocket_process import WebSocketProcess
import websockets
import asyncio
import os
import json
import math
import atexit
import logging
from arm_servos import ArmServos

class ControlReceiver(WebSocketProcess):
    def __init__(self, mpid, pipe, config_file):
        WebSocketProcess.__init__(self, mpid, pipe, config_file, 5555)
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # Create MotorHandler object to handle motors
        self.motors = MotorHandler(self.config)
        # When script exits or is interrupted stop all servos
        atexit.register(self.motors.close)
        # Default controller state object
        self.state = {
            "LEFT_STICK_X": 0.0,
            "LEFT_STICK_Y": 0.0,
            "LEFT_BOTTOM_SHOULDER": 0.0,
            "RIGHT_BOTTOM_SHOULDER": 0.0,
            "LEFT_TOP_SHOULDER": False,
            "RIGHT_TOP_SHOULDER": False
        }
        self.arm = ArmServos()

    def numkey_handler(self, control, value):
        if control == 'NUM8':
            ANGLES = self.arm.step_angles(ANGLES, self.arm.DIFF, self.arm.ACTUATION_RANGE, 1)
            self.arm.set_angles(ANGLES, [1,2])

        if control == 'NUM2':
            ANGLES = self.arm.step_angles(ANGLES, self.arm.DIFF, self.arm.ACTUATION_RANGE, -1)
            self.arm.set_angles(ANGLES, [1,2])

    def gamepad_movement_handler(self, type="TRIGGER"):
        if type == "TRIGGER":
            # Set speed range to be from 0 to `speed`
            left = self.state["LEFT_BOTTOM_SHOULDER"] * self.motors.speed
            right = self.state["RIGHT_BOTTOM_SHOULDER"] * self.motors.speed

            # If modifier pressed, then invert value
            left *= (-1) ** self.state["LEFT_TOP_SHOULDER"]
            right *= (-1) ** self.state["RIGHT_TOP_SHOULDER"]

            # Send command to servo handler, independent flag allows the two sides to operate independently
            self.motors.move(left, right, independent=True)
        else:
            x = self.state["LEFT_STICK_X"] * -1
            y = self.state["LEFT_STICK_Y"] * -1
            # Convert to polar
            r = math.hypot(y, x)
            t = math.atan2(x, y)
            # Rotate by 45 degrees
            t += math.pi / 4
            # Back to cartesian
            left = r * math.cos(t)
            right = r * math.sin(t)
            # Rescale the new coords
            left *= math.sqrt(2)
            right *= math.sqrt(2)
            # Clamp to -1/+1
            left = max(-1, min(left, 1))
            right = max(-1, min(right, 1))
            # Multiply by speed to get our final speed to be sent to the servos
            left *= self.motors.speed
            right *= self.motors.speed
            # Send command to servos
            self.motors.move(left, right)

    def keyboard_handler(self, control, value):
        speed = self.motors.speed
        if control == "FORWARD":
            self.motors.move(speed, speed)
        elif control == "BACKWARDS":
            self.motors.move(-speed, -speed)
        elif control == "LEFT":
            self.motors.move(-speed, speed)
        elif control == "RIGHT":
            self.motors.move(speed, -speed)
        elif control == "STOP":
            self.motors.stop()
        elif control == "SPEED_UP":
            if value == "DOWN":
                self.motors.speed = min(1023, speed + 128)
                # Send a message to SensorStream to update the interface with the current speed
                self.pipe.send(["SYNC_SPEED", self.motors.speed])
        elif control == "SPEED_DOWN":
            if value == "DOWN":
                self.motors.speed = max(127, speed - 128)
                # Send a message to SensorStream to update the interface with the current speed
                self.pipe.send(["SYNC_SPEED", self.motors.speed])
        elif "NUM" in control:
            self.numkey_handler(control, value)

    def message_handler(self, buf):
        # Load object from JSON
        msg = json.loads(buf)

        typ = msg["type"]  # axis, button, or keyboard
        control = msg["control"]  # FACE_0, LEFT_STICK_Y, SPEED_UP etc.

        if typ == "KEYBOARD":
            value = msg["value"] if "value" in msg else False  # UP, DOWN
            # Handle directional movement etc
            self.keyboard_handler(control, value)
        elif typ == "BUTTON":
            value = msg["value"]  # UP, DOWN
            # Store in state, because it might be useful (e.g. for modifiers)
            self.state[control] = True if value == "DOWN" else False
            # 
            if control == "LEFT_TOP_SHOULDER" or control == "RIGHT_TOP_SHOULDER":
                self.gamepad_movement_handler(type="TRIGGER")
            # Then handle any button events
            if control == "DPAD_LEFT":
                if value == "DOWN":
                    self.motors.speed = min(1023, self.motors.speed + 128)
                    self.pipe.send(["SYNC_SPEED", self.motors.speed])
            elif control == "DPAD_RIGHT":
                if value == "DOWN":
                    self.motors.speed = max(127, self.motors.speed - 128)
                    self.pipe.send(["SYNC_SPEED", self.motors.speed])
        elif typ == "AXIS":
            # If axis, store as float
            value = float(msg["value"])
            # Update state with new value of axis
            self.state[control] = value
            # Handle trigger and stick controls
            if control == "LEFT_STICK_X" or control == "LEFT_STICK_Y":
                self.gamepad_movement_handler(type="STICK")
            else:
                self.gamepad_movement_handler(type="TRIGGER")

    async def main(self, websocket, path):
        # Enter runtime loop
        while True:
            # Receive JSON formatted string from websocket
            try:
                buf = await websocket.recv()
            except websockets.exceptions.ConnectionClosed:
                break
            if len(buf) > 0:
                if self.config['debug']['print_messages']:
                    self.logger.info(buf)
                # Convert string data to object and then handle controls
                self.message_handler(buf)
