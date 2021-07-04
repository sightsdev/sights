# Wrapper for MotorKit adafruit motor controllers
from motor_wrapper import MotorWrapper
from adafruit_motorkit import MotorKit
import board

class MotorKitController(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'motorkit'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        self.kit = MotorKit(i2c=board.I2C())

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            self.kit.motor1.throttle = left / 1023
            self.kit.motor2.throttle = left / 1023
        # Right side
        if right is not None:
            self.kit.motor3.throttle = right / 1023
            self.kit.motor4.throttle = right / 1023

    def stop(self):
        self.kit.motor1.throttle = 0
        self.kit.motor2.throttle = 0
        self.kit.motor3.throttle = 0
        self.kit.motor4.throttle = 0
