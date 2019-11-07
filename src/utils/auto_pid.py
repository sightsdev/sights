#!/usr/bin/env python3
from pyax12.connection import Connection
from serial import Serial
from enum import IntEnum
from servo_party import ServoParty
import json
import time
import atexit

# Load config file
config = json.load(open('robot.json'))

# Servos
servo_party = ServoParty()
# Arduino
sc_arduino = Serial(port=config['arduino']['port'],
                    baudrate=config['arduino']['baudrate'])

# PID constants
K_p = 2
K_i = 1
K_d = 0

# Base speed of robot, before PID adjustments
speed = 400

# When script exits or is interrupted stop all servos
atexit.register(servo_party.close)


class Distance(IntEnum):
    FRONT = 0
    LEFT = 1
    RIGHT = 2
    BACK = 3


def getData():
    buf = sc_arduino.readline().decode("UTF-8")
    # If string begins with "D:", it's distance
    msg = {}
    if (buf[0] == "D"):
        # Strip leading "D:" and split by comma
        msg["distance"] = buf[2:-3].split(",")
    return msg


def main():
    # Set up variables
    integral = 0
    last_error = 0
    current_time = time.time()
    last_time = current_time
    reverse = False

    while True:
        msg = getData()
        if not msg == {}:
            # Get the four distances
            if reverse:
                back = int(msg["distance"][Distance.FRONT])
                front = int(msg["distance"][Distance.BACK])
                right = int(msg["distance"][Distance.LEFT])
                left = int(msg["distance"][Distance.RIGHT])
            else:
                front = int(msg["distance"][Distance.FRONT])
                back = int(msg["distance"][Distance.BACK])
                left = int(msg["distance"][Distance.LEFT])
                right = int(msg["distance"][Distance.RIGHT])

            if (not reverse and front < 100):
                servo_party.move(0, 0)
                reverse = True
                print("Reverse is true")
            elif (reverse and front < 100):
                servo_party.move(0, 0)
                reverse = False
                print("Reverse is false")
            else:
                #print("l:", left, "r:", right)

                # Get current time
                current_time = time.time()
                # Change in time since last loop
                delta_time = current_time - last_time

                # Our setpoint (SP) is 0, as we want the difference between the two sides to be 0. This is our target value.
                # Therefore, because our SP is 0, our current measured value is the same as the error which is difference between left and right
                error = left - right
                # Work out the change in error since the last loop
                delta_error = error - last_error

                # Our integral is the sum of all previous errors taking into account time
                integral += error * delta_time

                # Our derivative is the difference between this error and the last
                derivative = 0
                if (delta_time > 0):  # Generally we try to avoid dividing by zero
                    derivative = delta_error / delta_time

                # Each of our parameters are now multiplied by their respective constants
                pid = int((K_p * error) + (K_i * integral) +
                          (K_d * derivative))

                # Move servos
                if reverse:
                    servo_party.move(-speed - pid, -speed + pid)
                else:
                    servo_party.move(speed - pid, speed + pid)
                print(pid)

                # Update last_error to the current error
                last_error = error
                # Update last_time
                last_time = current_time


if __name__ == '__main__':
    main()
