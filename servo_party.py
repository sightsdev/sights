#!/usr/bin/env python3
from pyax12.connection import Connection
from enum import IntEnum

class Servo(IntEnum):
    LEFT_FRONT = 1
    RIGHT_FRONT = 2
    LEFT_BACK = 3
    RIGHT_BACK = 4
    
class ServoParty:
    sc_dynamixel = Connection(port="/dev/ttyACM0", baudrate=1000000)    
    speed_factor = 512
    last_left = 0
    last_right = 0

    def setup_servo(dynamixel_id):
        # Set the "wheel mode"
        sc.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        sc.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)

    def move_raw(left, right):
        # Left side
        sc_dynamixel.set_speed(Servo.LEFT_FRONT, left)
        sc_dynamixel.set_speed(Servo.LEFT_BACK, left)
        # Right side
        sc_dynamixel.set_speed(Servo.RIGHT_FRONT, right)
        sc_dynamixel.set_speed(Servo.RIGHT_BACK, right)
    
    def move_raw_left(left):
        # Left side
        sc_dynamixel.set_speed(Servo.LEFT_FRONT, left)
        sc_dynamixel.set_speed(Servo.LEFT_BACK, left)
        
    def move_raw_right(right):
        # Right side
        sc_dynamixel.set_speed(Servo.RIGHT_FRONT, right)
        sc_dynamixel.set_speed(Servo.RIGHT_BACK, right)

    def move(left, right):
        global last_left
        global last_right

        # Different motors need to spin in different directions. We account for that here.	
        if (left < 0):
            left *= -1
            left += 1024
        if (right < 0):
            right *= -1
        elif right < 1024:
            right += 1024
        
        # Only send message if it's different to the last one
        if (left != last_left and right != last_right):
            move_servos(left, right)
        
        # Store this message for comparison next time
        last_left = left
        last_right = right