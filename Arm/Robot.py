#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Tue May 21 21:37:46 2019

@author: sart
"""
from dynamixel_sdk import PortHandler
from Motors import *
from Motors import MotorGroup

    
    
        

class Robot():
    def __init__(self, motors, controller, port = "/dev/ttyUSB0", baudRate = 57600):
        self.portHandler = PortHandler(port)
        self.motors = MotorGroup(motors)
        self.controller = controller
    
    
    def start(self, baudRate = None):
        if not self.portHandler.is_open:
            if self.portHandler.openPort():
                print("Succeeded to open the port")
            else:
                print("Failed to open the port")
                return False
            # Set port baudrate
            if self.portHandler.setBaudRate(self.baudRate if baudRate is None else baudRate):
                print("Succeeded to change the baudrate")
            else:
                print("Failed to change the baudrate")
                return False
            #enable connected motors
            self.motors.enable()
        return True

    def close(self):
        self.motors.disable()
        self.portHandler.closePort()
        print("All closed")