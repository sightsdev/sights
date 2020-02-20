# Dynamixel AX-series motor connection using pyax12
from motor_wrapper import MotorWrapper
from pyax12.status_packet import RangeError
import pyax12.connection
import serial
import logging

class DynamixelConnection(MotorWrapper):
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

