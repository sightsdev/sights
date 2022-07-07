'''Notes For Sart ARM Code:
- Reverse Throttle (.throttle = -1)
- To stop continuous rotation set (throttle to 0:)
- To create new object for each HAT with
- pwm = PWM (0x40)
Numeric Keypad Controls:          
 _ _ _
|_|8|_|   8 > Up,   2 > Down
|4|5|6|   4 > Left, 6 > Right 
|_|2|_|   5 > Home Device
'''

#Importing Extra Functionality 
from adafruit_servokit import ServoKit

class ArmServos:

    def __init__(self):
        self.ACTUATION_RANGE = 180
        self.ANGLES = [0, 90]
        self.DIFF = 1/10 # as ratio of actuation range
        self.DIFF *= self.ACTUATION_RANGE

        #intialising statement starting that we will have acesses to 16 PWM channels of the hat
        self.kit = ServoKit (channels = 16)
        for i in range(16):
            self.kit.servo[i].actuation_range = self.ACTUATION_RANGE

        self.set_angles(self.ANGLES, [1,2])

    def step_angles(self, angles, diff, actuation_range, direction):
        """step the angles by the difference"""
        return [(angles[0] - direction*diff + actuation_range) % actuation_range,
                (angles[1] + direction*diff + actuation_range) % actuation_range]

    def set_angles(self, angles, indices):
        """set angles of motors to new angles"""
        assert len(indices) == len(angles), "Must have same number of ANGLES as servo indices"
        for i, a in zip(indices, angles):
            self.kit.servo[i].angle = a