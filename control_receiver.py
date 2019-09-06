#!/usr/bin/env python3
import websockets
import asyncio
import os
import json
import math
import atexit
import configparser
from servo_party import ServoParty

# Load config file
config = configparser.ConfigParser()
config.read('robot.cfg')

# Servos
servo_party = ServoParty()

# When script exits or is interrupted stop all servos
atexit.register(servo_party.close)

# Controller state object
state = {
    "LEFT_STICK_X": 0.0,
    "LEFT_STICK_Y": 0.0,
    "LEFT_BOTTOM_SHOULDER": 0.0,
    "RIGHT_BOTTOM_SHOULDER": 0.0,
    "LEFT_TOP_SHOULDER": False,
    "RIGHT_TOP_SHOULDER": False
}

directionalLookup = {
    "FORWARD": (512, 512),
    "BACKWARDS": (-512, -512),
    "LEFT": (-512, 512),
    "RIGHT": (512, -512)
}


def gamepadMovementHandler():
    if (state["LEFT_BOTTOM_SHOULDER"] != 0 or state["RIGHT_BOTTOM_SHOULDER"] != 0):
        left = state["LEFT_BOTTOM_SHOULDER"] * servo_party.speed_factor
        right = state["RIGHT_BOTTOM_SHOULDER"] * servo_party.speed_factor

        # If modifier pressed, than invert value
        left *= (-1) ** state["LEFT_TOP_SHOULDER"]
        right *= (-1) ** state["RIGHT_TOP_SHOULDER"]

        # Send command to servo handler, independent flag allows the two sides to operate independently
        servo_party.move(left, right, independent=True)
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

        # Multiply by speed_factor to get our final speed to be sent to the servos
        left *= servo_party.speed_factor
        right *= servo_party.speed_factor

        # Send command to servos
        servo_party.move(left, right)


def directionalMovement(control, value):
    if value == "UP":
        servo_party.move(0, 0)
    else:
        servo_party.move(
            directionalLookup[control][0],
            directionalLookup[control][1])


def controlHandler(buf):
    msg = json.loads(buf)

    typ = msg["type"]  # system, axis, button
    control = msg["control"]  # FACE_0, LEFT_STICK_Y, etc.

    if (typ == "AXIS"):
        # If axis, store as float
        value = float(msg["value"])
        # Update state with new value of axis
        state[control] = value
        # Handle trigger and stick controls
        gamepadMovementHandler()
    elif (typ == "SYSTEM"):
        # Handle power commands
        if (control == "SHUTDOWN"):
            print("RECEIVER: Received shutdown signal, shutting down...")
            os.system('poweroff')
        elif (control == "REBOOT"):
            print("RECEIVER: Received reboot signal, rebooting...")
            os.system('restart')
    elif (typ == "KEYBOARD"):
        value = msg["value"]  # UP, DOWN
        # Handle directional movement
        directionalMovement(control, value)
    elif (typ == "BUTTON"):
        value = msg["value"]  # UP, DOWN
        # Store in state, because it might be useful (e.g. for modifiers)
        state[control] = True if value == "DOWN" else False
        # Then handle any button events


async def recieveControlData(websocket, path):
    while True:
        # Recieve JSON formatted string from websockets
        try:
            buf = await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
            print("RECEIVER: Control server connection lost")
            break
        if len(buf) > 0:
            if config.getboolean('debug', 'debug_printout', fallback=False):
                print(buf)
            # Convert string data to object and then handle controls
            controlHandler(buf)


def main():
    print("RECEIVER: Starting control data reciever")
    start_server = websockets.serve(
        recieveControlData, config.get('network', 'ip'), 5555)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()
