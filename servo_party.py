#!/usr/bin/env python3
import pyax12.connection
from pyax12.status_packet import RangeError
from enum import IntEnum
import serial
import time

class Servo(IntEnum):
    LEFT_FRONT = 1
    RIGHT_FRONT = 2
    LEFT_BACK = 3
    RIGHT_BACK = 4

# Virtual motor connection
class VirtualConnection:
    def __init__(self):
        pass

    def move_raw(self, left=None, right=None):
        pass

    def stop(self):
        pass

    def close(self):
        pass


# Sabertooth motor connection using serial
class SerialConnection:
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.serial = serial.Serial(port=port, baudrate=baudrate)

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            msg = 64 + round(63 / 100 * max(min(left, 100), -100))
            self.serial.write(bytes([msg]))
        # Right side
        if right is not None:
            msg = 192 + round(63 / 100 * max(min(right, 100), -100))
            self.serial.write(bytes([msg]))

    def stop(self):
        self.serial.write(bytes([0]))

    def close(self):
        self.serial.close()


# Dynamixel AX-series motor connection using pyax12
class DynamixelConnection:
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.motors = pyax12.connection.Connection(
            port=port, baudrate=baudrate)

    def move_raw(self, left=None, right=None):
        # Both left and right are optional parameters
        if left is not None:
            # Different motors need to spin in different directions. We account for that here.
            if (left < 0):
                left *= -1
                left += 1024
            try:
                self.motors.set_speed(Servo.LEFT_FRONT, left)
                self.motors.set_speed(Servo.LEFT_BACK, left)
            except:
                self.crash(left, None)
        if right is not None:
            # Again, different motors need to spin in different directions
            if (right < 0):
                right *= -1
            elif right < 1024:
                right += 1024
            try:
                self.motors.set_speed(Servo.RIGHT_FRONT, right)
                self.motors.set_speed(Servo.RIGHT_BACK, right)
            except:
                self.crash(left, None)

    def stop(self):
        # Set all motors to 0
        self.motors.set_speed(1, 0)
        self.motors.set_speed(2, 0)
        self.motors.set_speed(3, 0)
        self.motors.set_speed(4, 0)

    def close(self):
        self.motors.close()

    def crash(self, left, right):
        self.close()
        print("SERVO_PARTY: Something went wrong sending message to servos:")
        print("Left: {} (was: {}) | Right: {} (was: {})".format(left, self.last_left, right, self.last_right))

    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.motors.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.motors.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)


class ServoParty:
    def __init__(self, config):
        # Load values from configuration file
        self.type = config['servo']['type'].lower()
        if (self.type != 'virtual'):
            self.port = config['servo']['port']
            self.baudrate = config['servo']['baudrate']
        self.gamepad_speed = config['control']['default_gamepad_speed'] * 128 - 1
        self.keyboard_speed = config['control']['default_keyboard_speed'] * 128 - 1
        self.last_left = 0
        self.last_right = 0
        # Whether to use a virtual or real servo connection
        if (self.type == 'virtual'):
            self.connection = VirtualConnection()
        elif (self.type == 'serial'):
            self.connection = SerialConnection(self.port, self.baudrate)
        elif (self.type == 'dynamixel'):
            self.connection = DynamixelConnection(self.port, self.baudrate)
        else:
            print("SERVO_PARTY: Could not determine motor connection type")
            print("SERVO_PARTY: Falling back to virtual connection")
            self.connection = VirtualConnection()
        print("SERVO_PARTY: Opening motor connection of type:", self.type)

    def stop(self):
        # Set all servos to 0
        self.connection.stop()
        self.last_left = 0
        self.last_right = 0

    def close(self):
        print("SERVO_PARTY: Closing motor connection")
        # Set all servos to 0 and close connection
        self.connection.stop()
        self.connection.close()

    def move(self, left, right, independent=False):
        # Make sure we don't have any decimals
        left = round(left)
        right = round(right)

        if (independent):
            # Allow left and right to be independent
            if (left != self.last_left):
                self.move_raw(left=left)
            if (right != self.last_right):
                self.move_raw(right=right)
        else:
            # Not independent, both left and right must have changed
            if (left != self.last_left and right != self.last_right):
                self.connection.move_raw(left, right)

        # Store this message for comparison next time
        self.last_left = left
        self.last_right = right
