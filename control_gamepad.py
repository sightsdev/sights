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
servo_party = ServoParty(
    port=config['servo']['port'], dummy=config['debug'].getboolean('dummy_servo', fallback=False))

# When script exits or is interrupted stop all servos
atexit.register(servo_party.stop)

# Controller state object
state = {}
state["LEFT_STICK_X"] = 0.0
state["LEFT_STICK_Y"] = 0.0
state["LEFT_BOTTOM_SHOULDER"] = 0.0
state["RIGHT_BOTTOM_SHOULDER"] = 0.0
state["LEFT_TOP_SHOULDER"] = False
state["RIGHT_TOP_SHOULDER"] = False


def steering():
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

    # Make sure we don't have any decimals
    left = round(left)
    right = round(right)

    # Different motors need to spin in different directions. We account for that here.
    if (left < 0):
        left *= -1
        left += 1024
    if (right < 0):
        right *= -1
    elif right < 1024:
        right += 1024

    # Only send message if it's different to the last one
    if (left != servo_party.last_left and right != servo_party.last_right):
        # print(left, ",", right)
        servo_party.move_raw(left, right)

    # Store this message for comparison next time
    servo_party.last_left = left
    servo_party.last_right = right


def tank_control():
    left = state["LEFT_BOTTOM_SHOULDER"]  # * servo_party.speed_factor
    right = state["RIGHT_BOTTOM_SHOULDER"]  # * servo_party.speed_factor

    # Reverse modifiers
    if (state["LEFT_TOP_SHOULDER"]):
        left *= -1
    if (state["RIGHT_TOP_SHOULDER"]):
        right *= -1

    #print(left, right)

    # Make sure we don't have any decimals
    left = round(left)
    right = round(right)

    # The servos use 0 - 1023 as clockwise and 1024 - 2048 as counter clockwise, we account for that here
    if (left < 0):
        left *= -1
        left += 1024
    if (right < 0):
        right *= -1
    else:
        right += 1024

    # Only send message if it's different to the last one
    if (left != servo_party.last_left):
        servo_party.move_raw_left(left)
    if (right != servo_party.last_right):
        servo_party.move_raw_right(right)

    # Store this message for comparison next time
    servo_party.last_left = left
    servo_party.last_right = right


def controlHandler(buf):
    msg = json.loads(buf)

    typ = msg["type"] # system, axis, button
    control = msg["control"] # FACE_0, LEFT_STICK_Y, etc.

    if (typ == "axis"):
        # If axis, store as float
        value = float(msg["value"])
        # Update state with new value of axis
        state[control] = value
    elif (typ == "system"):
        # Handle power commands
        if (control == "shutdown"):
            print("Shutting down")
            #os.system('poweroff')
        elif (control == "reboot"):
            print("Rebooting")
            #os.system('restart')
    else:  # type == "button"
        value = msg["value"] # UP, DOWN
        # Store in state, because it might be useful
        state[control] = True if value == "DOWN" else False
        # Then handle any button events

    # steering()
    tank_control()


async def recieveControlData(websocket, path):
    while True:
        # Recieve JSON formatted string from websockets
        try:
            buf = await websocket.recv()
        except websockets.exceptions.ConnectionClosed:
            print("RECEIVER: Control server connection lost")
            break
        if len(buf) > 0:
            if config['debug'].getboolean('debug_printout', fallback=False):
                print(buf)
            # Convert string data to object and then handle controls
            controlHandler(buf)


def main():
    print("RECEIVER: Starting control data reciever")
    start_server = websockets.serve(
        recieveControlData, config['network']['ip'], 5555)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()
