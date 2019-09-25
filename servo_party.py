#!/usr/bin/env python3
from pyax12.connection import Connection
from pyax12.status_packet import RangeError
from enum import IntEnum
import serial
import time

class Servo(IntEnum):
    LEFT_FRONT = 1
    RIGHT_FRONT = 2
    LEFT_BACK = 3
    RIGHT_BACK = 4

# Replicates the pyax12 Connection class
class VirtualConnection:
    def __init__(self):
        print("DEBUG: Opened virtual servo connection")

    def set_speed (self, id, speed):
        pass

    def close (self):
        print("DEBUG: Closed virtual servo connection")
    
    def set_cw_angle_limit (self, dynamixel_id, angle_limit, degrees=False):
        pass
    
    def set_ccw_angle_limit (self, dynamixel_id, angle_limit, degrees=False):
        pass


class ServoParty:
    def __init__(self, config):
        # Load values from configuration file
        self.port = config['servo']['port']
        self.baudrate = config['servo']['baudrate']
        self.gamepad_speed = config['control']['default_gamepad_speed'] * 128 - 1
        self.keyboard_speed = config['control']['default_keyboard_speed'] * 128 - 1
        self.last_left = 0
        self.last_right = 0
        # Whether to use a virtual or real servo connection
        if (config['debug']['use_virtual_servos']):
            self.sc = VirtualConnection()
        else:
            self.sc = Connection(port=self.port, baudrate=self.baudrate)
        self.ser = serial.Serial(port='/dev/ttyAMA0', baudrate=9600, )

    def stop(self):
        # Set all servos to 0
        self.ser.write(bytes([0]))
        #self.sc.set_speed(1, 0)
        #self.sc.set_speed(2, 0)
        #self.sc.set_speed(3, 0)
        #self.sc.set_speed(4, 0)
        self.last_left = 0
        self.last_right = 0
    
    def close(self):
        # Set all servos to 0
        self.stop();
        # Close the connection
        #self.sc.close()

    def setup_servo(self, dynamixel_id):
        # Set the "wheel mode"
        self.sc.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
        self.sc.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)

    def move_raw(self, left, right):
        # Left side
        val = 64 + round(63 / 100 * max(min(left, 100), -100))
        self.ser.write(bytes([val]))
        # Right side
        val = 192 + round(63 / 100 * max(min(right, 100), -100))
        self.ser.write(bytes([val]))
        
        
        '''try:
            # Left side
            self.sc.set_speed(Servo.LEFT_FRONT, left)
            self.sc.set_speed(Servo.LEFT_BACK, left)
            # Right side
            self.sc.set_speed(Servo.RIGHT_FRONT, right)
            self.sc.set_speed(Servo.RIGHT_BACK, right)
        except:
            self.crash(left, right)
    '''

    def move_raw_left(self, left):
        val = 64 + round(63 / 100 * max(min(left, 100), -100))
        self.ser.write(bytes([val]))
        '''# Left side
        try:
            self.sc.set_speed(Servo.LEFT_FRONT, left)
            self.sc.set_speed(Servo.LEFT_BACK, left)
        except:
            self.crash(left, None)'''

    def move_raw_right(self, right):
        val = 192 + round(63 / 100 * max(min(right, 100), -100))
        self.ser.write(bytes([val]))
        # Right side
        '''try:
            self.sc.set_speed(Servo.RIGHT_FRONT, right)
            self.sc.set_speed(Servo.RIGHT_BACK, right)
        except:
            self.crash(None, right)'''
        
    def crash(self, left, right):
        self.close()
        print("SERVO_PARTY: Something went wrong sending message to servos:")
        print("Left: ", left, "(was:", self.last_left, ") | Right:", right, "(was:", self.last_right, ")")
        print("Disabling real servos, swapping to virtual connection")
        self.sc = VirtualConnection()

    def move(self, left, right, independent=False):
        # Make sure we don't have any decimals
        left = round(left)
        right = round(right)
    
    # Different motors need to spin in different directions. We account for that here.
        '''if (left < 0):
            left *= -1
            left += 1024
        if (right < 0):
            right *= -1
        elif right < 1024:
            right += 1024'''

        # Only send message if it's different to the last one
        if (independent):
            # Allow left and right to be independent
            if (left != self.last_left):
                self.move_raw_left(left)
            if (right != self.last_right):
                self.move_raw_right(right)
        else:
            # Not independent, both left and right must have changed
            if (left != self.last_left and right != self.last_right):
                self.move_raw(left, right)
    
        # Store this message for comparison next time
        self.last_left = left
        self.last_right = right
