# Sabertooth motor connection using serial
from motor_wrapper import MotorWrapper
import serial
import logging

class SabertoothConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'sabertooth'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        self.port = config.get('port')
        self.baudrate = config.get('baudrate')
        # Try
        self.serial = serial.Serial(port=self.port, baudrate=self.baudrate)

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
