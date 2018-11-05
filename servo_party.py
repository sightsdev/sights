#!/usr/bin/env python3
from pyax12.connection import Connection
from enum import IntEnum


class Servo(IntEnum):
    LEFT_FRONT = 1
    RIGHT_FRONT = 2
    LEFT_BACK = 3
    RIGHT_BACK = 4


class ServoParty:
    def __init__(self):
        self.sc_dynamixel = Connection(port="/dev/ttyACM0", baudrate=1000000)
        self.speed_factor = 512
        self.last_left = 0
        self.last_right = 0

    def stop(self):
        self.sc_dynamixel.set_speed(1, 0)
        self.sc_dynamixel.set_speed(2, 0)
        self.sc_dynamixel.set_speed(3, 0)
        self.sc_dynamixel.set_speed(4, 0)
        self.sc_dynamixel.close()
	
    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.sc_dynamixel.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.sc_dynamixel.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)
        
    def move_raw(self, left, right):
        # Left side
        self.sc_dynamixel.set_speed(Servo.LEFT_FRONT, left)
        self.sc_dynamixel.set_speed(Servo.LEFT_BACK, left)
        # Right side
        self.sc_dynamixel.set_speed(Servo.RIGHT_FRONT, right)
        self.sc_dynamixel.set_speed(Servo.RIGHT_BACK, right)
    
    def move_raw_left(self, left):
        # Left side
        self.sc_dynamixel.set_speed(Servo.LEFT_FRONT, left)
        self.sc_dynamixel.set_speed(Servo.LEFT_BACK, left)
        
    def move_raw_right(self, right):
        # Right side
        self.sc_dynamixel.set_speed(Servo.RIGHT_FRONT, right)
        self.sc_dynamixel.set_speed(Servo.RIGHT_BACK, right)

    def move(self, left, right):

        # Different motors need to spin in different directions. We account for that here.  
        if (left < 0):
            left *= -1
            left += 1024
        if (right < 0):
            right *= -1
        elif right < 1024:
            right += 1024
        
        # Only send message if it's different to the last one
        if (left != self.last_left and right != self.last_right):
            self.move_raw(left, right)
        
        # Store this message for comparison next time
        self.last_left = left
        self.last_right = right
