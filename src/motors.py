#!/usr/bin/env python3
import pyax12.connection
from pyax12.status_packet import RangeError
import serial
import logging

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
                for servo in self.ids['left']:
                    self.motors.set_speed(servo, left)
            except:
                self.crash(left, None)
        if right is not None:
            # Again, different motors need to spin in different directions
            if (right < 0):
                right *= -1
            elif right < 1024:
                right += 1024
            try:
                for servo in self.ids['right']:
                    self.motors.set_speed(servo, right)
            except:
                self.crash(None, right)

    def stop(self):
        # Set all motors to 0
        self.motors.set_speed(1, 0)
        self.motors.set_speed(2, 0)
        self.motors.set_speed(3, 0)
        self.motors.set_speed(4, 0)

    def close(self):
        self.motors.close()

    def crash(self, left, right):
        self.logger.error("Something went wrong sending message to servos:")
        self.logger.error("Left: {} (was: {}) | Right: {} (was: {})".format(left, self.last_left, right, self.last_right))
        self.logger.info("Attempting to reopen connection")
        # Reopen connection
        self.motors = pyax12.connection.Connection(
            port=self.port, baudrate=self.baudrate)
        self.logger.info("Attempting to stop servos")
        self.stop()


    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.motors.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.motors.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)


class Motors:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # Load values from configuration file
        self.type = config['motors']['type'].lower()
        if (self.type != 'virtual'):
            self.port = config['motors']['port']
            self.baudrate = config['motors']['baudrate']
        self.gamepad_speed = config['control']['default_gamepad_speed'] * 128 - 1
        self.keyboard_speed = config['control']['default_keyboard_speed'] * 128 - 1
        self.last_left = 0
        self.last_right = 0
        # Whether to use a virtual or real servo connection
        if (self.type == 'virtual'):
            self.connection = VirtualConnection()
        elif (self.type in ['serial', 'dynamixel']):
            try:
                if (self.type == 'serial'):
                    self.connection = SerialConnection(self.port, self.baudrate)
                elif (self.type == 'dynamixel'):
                    self.connection = DynamixelConnection(self.port, self.baudrate)
                    self.connection.ids = config['motors']['ids']
                    self.connection.logger = self.logger
            except serial.serialutil.SerialException:
                self.logger.warning(f"Unable to create {self.type} motor connection")
                self.logger.info("Falling back to virtual connection")
                self.connection = VirtualConnection()
        else:
            self.logger.warning("Could not determine motor connection type")
            self.logger.info("Falling back to virtual connection")
            self.connection = VirtualConnection()
        self.logger.info("Opening motor connection of type: {}".format(self.type))

    def stop(self):
        # Set all servos to 0
        self.connection.stop()
        self.last_left = 0
        self.last_right = 0

    def close(self):
        self.logger.info("Closing motor connection")
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
                self.connection.move_raw(left=left)
            if (right != self.last_right):
                self.connection.move_raw(right=right)
        else:
            # Not independent, both left and right must have changed
            if (left != self.last_left and right != self.last_right):
                self.connection.move_raw(left, right)

        # Store this message for comparison next time
        self.last_left = left
        self.last_right = right
