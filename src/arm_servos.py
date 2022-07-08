'''
Numeric Keypad Controls:          
 _ _ _
|_|8|_|   TBC
|4|5|6|   
|_|2|_|   0 > Home Device
'''

#Importing Extra Functionality 
from adafruit_servokit import ServoKit
import RPi.GPIO as GPIO

class ArmServos:
    SHOULDER = 0
    ELBOW = 1
    WRISTUD = 2
    WRISTLR = 3
    CLAW = 4
    ANGLES = [180, 180, 90, 90, 90]
    HOME = [180, 180, 90, 90, 90]

    def __init__(self):
        self.kit = ServoKit (channels = 16)
        for i in [0,1,2]:
            self.kit.servo[i].set_pulse_width_range(500, 2370)
        for i in [3,4]:
            self.kit.servo[i].set_pulse_width_range(350, 2450)

        self.home()

    def home(self):
        for i, a in zip(range(5), self.HOME):
            self.kit.servo[i].angle = a
            self.ANGLES[i] = self.HOME[i]

    def increment_angle(self, joint, direction, amount=180/100):
        """step the angles by the difference"""
        self.ANGLES[joint] =  max(min(self.ANGLES[joint] + amount * (1 if direction else -1),180),0)
        self.kit.servo[joint].angle = self.ANGLES[joint]
