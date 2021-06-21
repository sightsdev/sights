from motor_wrapper import MotorWrapper
import serial
import logging
from pyroboclaw import RoboClaw

class RoboClawConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'roboclaw'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        self.port = config.get('port')
        self.address = 0x80
        self.channels = config.get('channels')
        self.connection = RoboClaw(port=self.port, address=self.address)
        try:
            self.channels.get('left')
            self.channels.get('right')
        except AttributeError:
            self.channels['left'] = 1
            self.channels['right'] = 0

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            self.connection.drive_motor(self.channels.get('left'), round(62 / 1000 * left))
        # Right side
        if right is not None:
            self.connection.drive_motor(self.channels.get('right'), round(62 / 1000 * right))

    def stop(self):
        self.connection.stop_all()

    def close(self):
        self.connection = None
