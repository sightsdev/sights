# Dynamixel AX-series motor connection using pyax12
from sights.api import v1 as api
from sights.components.motor import *
from dataclasses import dataclass
import logging

@dataclass
class DynamixelConnectionConfig(ConnectionConfig):
    port: str
    baudrate: int
       
class DynamixelConnection(Connection):
    # Called by plugin lifetime handler
    def configure(self):
        from pyax12.status_packet import RangeError
        import pyax12.connection   
        self.con = pyax12.connection.Connection(
            port=self.config.port, baudrate=self.config.baudrate)

    def stop(self):
        # Set all motors to 0
        for servo in self.motors:
            servo.move(0, True)

    def close(self):
        self.con.close()

    def crash(self, left, right):
        self.logger.error("Something went wrong sending message to servos:")
        self.logger.info("Attempting to reopen connection")
        # Reopen connection
        self.con = pyax12.connection.Connection(
            port=self.config.port, baudrate=self.config.baudrate)
        self.logger.info("Attempting to stop servos")
        self.stop()

@dataclass
class DynamixelMotorConfig(MotorConfig):
    connection: DynamixelConnection
    channel: int

class DynamixelMotor(Motor):
    def set_speed(self, speed):
        if self.enabled:
            self.config.connection.con.set_speed(self.config.channel, speed)

    # Always stop regardless of value of enabled
    def stop(self):
        self.config.connection.con.set_speed(self.config.channel, 0)

    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.config.connection.con.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.config.connection.con.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)


api.plugins.register_motor_plugin(MotorPlugin(
    name="Dynamixel",
    description="Dynamixel Servo Connection",
    channels=2,
    connection_class=DynamixelConnection,
    connection_config=DynamixelConnectionConfig,
    motor_class=DynamixelMotor,
    motor_config=DynamixelMotorConfig
))
