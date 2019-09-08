#!/usr/bin/env python3
import websockets
import asyncio
import os
import json
import math
import atexit
from servo_party import ServoParty

# Load config file
config = json.load(open('robot.json'))

# Servos
servo_party = ServoParty(config)

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

def gamepad_movement_handler():
    if (state["LEFT_BOTTOM_SHOULDER"] != 0 or state["RIGHT_BOTTOM_SHOULDER"] != 0):
        left = state["LEFT_BOTTOM_SHOULDER"] * servo_party.gamepad_speed
        right = state["RIGHT_BOTTOM_SHOULDER"] * servo_party.gamepad_speed

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

        # Multiply by gamepad_speed to get our final speed to be sent to the servos
        left *= servo_party.gamepad_speed
        right *= servo_party.gamepad_speed

        # Send command to servos
        servo_party.move(left, right)


def keyboard_handler(control, value):
    speed = servo_party.keyboard_speed
    if (control == "FORWARD"):
        if value == "UP":
            servo_party.move(0, 0)
        else:
            servo_party.move(speed, speed)
    elif (control == "BACKWARDS"):
        if value == "UP":
            servo_party.move(0, 0)
        else:
            servo_party.move(-speed, -speed)
    elif (control == "LEFT"):
        if value == "UP":
            servo_party.move(0, 0)
        else:
            servo_party.move(-speed, speed)
    elif (control == "RIGHT"):
        if value == "UP":
            servo_party.move(0, 0)
        else:
            servo_party.move(speed, -speed)
    elif (control == "SPEED_UP"):
        if value == "DOWN":
            servo_party.keyboard_speed = min(1024, speed + 128)
            pipe.send(["SYNC_SPEED", "kb", servo_party.keyboard_speed])
    elif (control == "SPEED_DOWN"):
        if value == "DOWN":
            servo_party.keyboard_speed = max(128, speed - 128)
            pipe.send(["SYNC_SPEED", "kb", servo_party.keyboard_speed])

def save_config(cfg):
    # Save new config to file
    with open('robot.json', 'w') as f:
        f.write(cfg)
    # Reload config 
    config = json.load(open('robot.json'))

def message_handler(buf):
    msg = json.loads(buf)

    typ = msg["type"]  # system, axis, button
    control = msg["control"]  # FACE_0, LEFT_STICK_Y, etc.

    if (typ == "AXIS"):
        # If axis, store as float
        value = float(msg["value"])
        # Update state with new value of axis
        state[control] = value
        # Handle trigger and stick controls
        gamepad_movement_handler()
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
            save_config(msg["value"])
        elif (control == "REQUEST_CONFIG"):
            print("RECEIVER: Received request for configuration file")
            # Send a message to sensor_stream requesting that they send the config file again
            pipe.send(["REQUEST_CONFIG"])
    elif (typ == "KEYBOARD"):
        value = msg["value"]  # UP, DOWN
        # Handle directional movement etc
        keyboard_handler(control, value)
    elif (typ == "BUTTON"):
        value = msg["value"]  # UP, DOWN
        # Store in state, because it might be useful (e.g. for modifiers)
        state[control] = True if value == "DOWN" else False
        # Then handle any button events
        if (control == "DPAD_UP"):
            if value == "DOWN":
                servo_party.gamepad_speed = min(1024, servo_party.gamepad_speed + 128)
        elif (control == "DPAD_DOWN"):
            if value == "DOWN":
                servo_party.gamepad_speed = max(128, servo_party.gamepad_speed - 128)


async def receive_control_data(websocket, path):
    while True:
        # Recieve JSON formatted string from websockets
        try:
            buf = await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
            print("RECEIVER: Control server connection lost")
            break
        if len(buf) > 0:
            if config['debug']['print_messages']:
                print(buf)
            # Convert string data to object and then handle controls
            message_handler(buf)


def main():
    print("RECEIVER: Starting control data reciever")
    start_server = websockets.serve(
        receive_control_data, config['network']['ip'], 5555)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()
