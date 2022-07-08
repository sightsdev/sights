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

    def __init__(self):
        self.SHOULDER = 0
        self.ELBOW = 1
        self.WRISTUD = 2
        self.WRISTLR = 3
        self.CLAW = 4
        self.ANGLES = [180, 160, 100, 76, 20]
        self.HOME = [180, 160, 100, 76, 20]
        self.kit = ServoKit (channels = 16)
        self.kit.servo[0].set_pulse_width_range(900, 2218)
        self.kit.servo[1].set_pulse_width_range(900, 2355)
        self.kit.servo[2].set_pulse_width_range(550, 2370)
        self.kit.servo[3].set_pulse_width_range(350, 2450)
        self.kit.servo[4].set_pulse_width_range(350, 2450)

        self.home()

    def home(self):
        for i, a in zip(range(5), self.HOME):
            self.kit.servo[i].angle = a
            self.ANGLES[i] = self.HOME[i]

    def increment_angle(self, joint, direction, amount=180/100):
        """step the angles by the difference"""
        self.ANGLES[joint] =  max(min(self.ANGLES[joint] + amount * (1 if direction else -1),180),0)
        self.kit.servo[joint].angle = self.ANGLES[joint]
