# -*- coding: utf-8 -*-
"""
Created on Wed Jun 19 15:41:17 2019

@author: Alexander_Cavalli
"""
import atexit
import time

from dynamixel_sdk import *
from Controller import XBoxOne
from Robot import Robot
from Motors import MX12W, MotorGroup, XL430W250, AX12A

class SARTRobot(Robot):
    def __init__(self, port="/dev/ttyUSB0",  baudrate=1000000, arm=False, wheels=False):
        super().__init__(dict(), port, baudrate)
        if arm:
            print("arm")
            self.motors.addMotor("arm", MotorGroup({
            "shoulder":MotorGroup({
                    "left":XL430W250(5, self.portHandler, baudrate=1000000),
                    "right":XL430W250(6, self.portHandler, baudrate=1000000, reverse=True),
                    }), 
            "elbow":MotorGroup({
                    "left":XL430W250(7, self.portHandler, baudrate=1000000),
                    "right":XL430W250(8, self.portHandler, baudrate=1000000, reverse=True),
                    }), 
            "Hand":MotorGroup({
                    "left":XL430W250(9, self.portHandler, baudrate=1000000),
                    "right":XL430W250(10, self.portHandler, baudrate=1000000, reverse=True),
                    }),
            }))
            self.Arm = self.motors["arm"]
        if wheels:
            print("wheels")
            print(type(self.motors))
            self.motors["wheels"] = MotorGroup({
            "left":MotorGroup({
                    "front":AX12A(1, self.portHandler, baudrate=1000000, driveMode="Wheel"),
                    "back":AX12A(3, self.portHandler, baudrate=1000000, reverse=True, driveMode="Wheel"),
                    }),
            "right":MotorGroup({
                    "front":AX12A(2, self.portHandler, baudrate=1000000, driveMode="Wheel"),
                    "back":AX12A(4, self.portHandler, baudrate=1000000, reverse=True, driveMode="Wheel"),
                    })
            })
            self.Wheels = self.motors["wheels"]
        print("enabled {}".format( self.enable()))
    
    def tank(self, left, right, normalised = True):
        if self.Wheels is not None:
            self.Wheels["left"].setGoalSpeed(left, normalised)
            self.Wheels["right"].setGoalSpeed(right, normalised)
            
    
mkIV = SARTRobot(wheels=True, port="COM6") #for windows
# When script exits or is interrupted stop all servos
#port = PortHandler("COM6")
#port.openPort()
#motorTest = AX12A(4, port, baudrate=1000000, driveMode="Wheel", reverse=True)

#def onClose():
#    motorTest.disable()
#    port.closePort()

#atexit.register(mkIV.close)
tm1 = 0
mkIV.enable()

#print("Min: {}".format(motorTest.read(motorTest.MIN_POSITION)))
#print("Max: {}".format(motorTest.read(motorTest.MAX_POSITION)))

while 1:
    for speed in range(0,2047, 100):
        mkIV.Wheels.setGoalSpeed(speed, False)
        print("current speed: {}, {}".format(speed, speed&(~(1<<10))))
        print(mkIV.motors.isenabled())
        connectivity = mkIV.countConnected()
        print("{} connected out of {}".format(connectivity[0], connectivity[1]))
        time.sleep(1)
        
    
    


