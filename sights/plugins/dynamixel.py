# Dynamixel AX-series motor connection using pyax12
from sights.api import v1 as api
from sights.components.motor import *
from dataclasses import dataclass
import logging

@dataclass
class DynamixelConnection(MotorConnection):
    port: str
    baudrate: int
       
    # Called by plugin lifetime handler
    def configure(self):
        from pyax12.status_packet import RangeError
        import pyax12.connection
        import serial   
        self.driver = pyax12.connection.Connection(
            port=self.port, baudrate=self.baudrate)

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

@dataclass
class DynamixelMotor(Motor):
    connection: DynamixelConnection
    channel: int
    
    def set_speed(self, speed, force: bool = False):
        if self.enabled or force:
            self.connection.driver.set_speed(self.channel, speed)

    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.connection.con.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.connection.con.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)


api.plugins.register_motor_plugin(api.MotorPlugin(
    name="Dynamixel",
    description="Dynamixel Servo Connection",
    channels=2,
    connection_class=DynamixelConnection,
    motor_class=DynamixelMotor
))
