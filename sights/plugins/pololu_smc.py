# Pololu SMC motor connection over serial
from sights.api import v1 as api
from sights.components.motor import *
from dataclasses import dataclass
import logging

'''
For now, the Simple Motor Controller G2s input mode must be Serial/USB, 
the serial mode must be Binary, and the CRC must be disabled. 
These are the default settings that the controller is shipped with

TODO: have a look into device_number and multiple devices at the same time
ref: https://www.pololu.com/docs/0J77/8.8
'''

@dataclass
class PololuSMCConnectionConfig(ConnectionConfig):
    port: str
    baudrate: int
    device_number: int
       
class PololuSMCConnection(Connection):
    # Called by plugin lifetime handler
    def configure(self):
        import serial
        self.bus = serial.Serial(self.config.port, self.config.baudrate, timeout=0.1, write_timeout=0.1)

    def stop(self):
        # Set all motors to 0
        # https://www.pololu.com/docs/0J77/6.2.1
        self.send_command(0xE0)

    def close(self):
        self.bus.close()

    def send_command(self, cmd, *data_bytes):
        if self.device_number == None:
            header = [cmd]  # Compact protocol
        else:
            header = [0xAA, self.device_number, cmd & 0x7F]  # Pololu protocol
        self.bus.write(bytes(header + list(data_bytes)))

    # Sends the Exit Safe Start command, which is required to drive the motor.
    def exit_safe_start(self):
        self.send_command(0x83)

    # Gets the specified variable as an unsigned value.
    def get_variable(self, id):
        self.send_command(0xA1, id)
        result = self.bus.read(2)
        if len(result) != 2:
            raise RuntimeError("Expected to read 2 bytes, got {}.".format(len(result)))
        b = bytearray(result)
        return b[0] + 256 * b[1]

    # Gets the specified variable as a signed value.
    def get_variable_signed(self, id):
        value = self.get_variable(id)
        if value >= 0x8000:
            value -= 0x10000
        return value

    # Gets a number where each bit represents a different error, and the
    # bit is 1 if the error is currently active.
    # See the user's guide for definitions of the different error bits.
    def get_error_status(self):
        return self.get_variable(0)


@dataclass
class PololuSMCMotorConfig(MotorConfig):
    connection: PololuSMCConnection
    channel: int

class PololuSMCMotor(Motor):
    def configure(self):
        # Exit safe start and enable movement
        self.config.connection.exit_safe_start()

    # Sets the SMC's target speed (-100, 100)
    def set_speed(self, speed):
        if self.enabled:
            # Scale to (-3200 to 3200).
            speed = speed * 32
            
            cmd = 0x85  # Motor forward
            if speed < 0:
                cmd = 0x86  # Motor reverse
                speed = -speed
            self.config.connection.send_command(cmd, speed & 0x1F, speed >> 5 & 0x7F)

    # Gets the target speed (-3200 to 3200).
    def get_speed(self):
        return self.config.connection.get_variable_signed(20)

    # Always stop regardless of value of enabled
    def stop(self):
        self.config.connection.send_command(0xE0)

api.plugins.register_motor_plugin(MotorPlugin(
    name="Pololu SMC",
    description="Pololu SMC Connection",
    channels=1,
    connection_class=PololuSMCConnection,
    connection_config=PololuSMCConnectionConfig,
    motor_class=PololuSMCMotor,
    motor_config=PololuSMCMotorConfig
))
