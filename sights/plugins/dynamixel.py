# Dynamixel AX-series motor connection using pyax12
from sights.api import v1 as api
from sights.components.motor import *
from dataclasses import dataclass
import logging

class DynamixelConnection(MotorConnection):

    def __init__(self, **config):
        from pyax12.status_packet import RangeError
        import pyax12.connection
        import serial   
        MotorConnection.__init__(self, config)
        self.port = config.get('port')
        self.baudrate = config.get('baudrate')
        self.ids = config.get('ids')
        self.con = pyax12.connection.Connection(
            port=self.port, baudrate=self.baudrate)

    def move_raw(self, left=None, right=None):
        # Both left and right are optional parameters
        if left is not None:
            # Different motors need to spin in different directions. We account for that here.
            if left < 0:
                left *= -1
                left += 1024
            try:
                for servo in self.ids['left']:
                    self.con.set_speed(servo, left)
            except:
                self.crash(left, None)
        if right is not None:
            # Again, different motors need to spin in different directions
            if right < 0:
                right *= -1
            elif right < 1024:
                right += 1024
            try:
                for servo in self.ids['right']:
                    self.con.set_speed(servo, right)
            except:
                self.crash(None, right)

    def move_motor(self, channel, speed):
        self.con.set_speed(channel, speed)

    def stop(self):
        # Set all motors to 0
        for servo in self.motors:
            servo.move(0, True)

    def close(self):
        self.con.close()

    def crash(self, left, right):
        self.logger.error("Something went wrong sending message to servos:")
        self.logger.error(
            "Left: {} (was: {}) | Right: {} (was: {})".format(left, self.last_left, right, self.last_right))
        self.logger.info("Attempting to reopen connection")
        # Reopen connection
        self.con = pyax12.connection.Connection(
            port=self.port, baudrate=self.baudrate)
        self.logger.info("Attempting to stop servos")
        self.stop()

class DynamixelMotor(Motor):
    def __init__(self, connection: DynamixelConnection, channel: int):
        self.connection = connection
        self.channel = channel
    
    def move(self, speed, force: bool = False):
        if self.enabled or force:
            self.connection.move_motor(self.channel, speed)

    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.connection.con.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.connection.con.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)
