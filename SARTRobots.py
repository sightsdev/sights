# -*- coding: utf-8 -*-
"""
Created on Wed Jun 26 14:26:06 2019

@author: Alexander_Cavalli
"""
from pynamixel.robot import RobotBase
from pynamixel.motors import XL430W250, MotorGroup, AX12A


class MarkIV(RobotBase):
    Arm = None
    Wheels = None
    def __Arm__(self, portHandler, baud):
        return MotorGroup({
            "shoulder":MotorGroup({
                    "left":XL430W250(5, portHandler, baudrate=baud, reverse=True),
                    "right":XL430W250(6, portHandler, baudrate=baud),
                    }), 
            "elbow":MotorGroup({
                    "left":XL430W250(7, portHandler, baudrate=baud, reverse=True),
                    "right":XL430W250(8, portHandler, baudrate=baud),
                    }),
            "hand":XL430W250(9, portHandler, baudrate=baud, reverse=True),
            })
    
    def __Wheels__(self, portHandler, baud):
        return MotorGroup({
            "left":AX12A(3, portHandler, baudrate=baud, driveMode="Wheel"),
            "right":AX12A(4, portHandler, baudrate=baud,reverse = True, driveMode="Wheel"),
            })
    def __Paddles__(self, portHandler, baud):
        return MotorGroup({
            "left":XL430W250(1, portHandler, baudrate=baud, driveMode="Wheel"),
            "right":XL430W250(2, portHandler, baudrate=baud,reverse = True, driveMode="Wheel"),
            })
    
    
    def __init__(self, port="/dev/ttyUSB0",  baudrate=1000000, arm=True, wheels=True, paddles = True):
        super().__init__(dict(), port, baudrate)
        if arm:
            self.motors.addMotor("arm", self.__Arm__(self.portHandler, baudrate))
            self.Arm = self.motors["arm"]
        if wheels:
            self.motors.addMotor("wheels", self.__Wheels__(self.portHandler, baudrate))
            self.Wheels = self.motors["wheels"]
        if paddles:
            self.motors.addMotor("paddles", self.__Paddles__(self.portHandler, baudrate))
            self.Paddles = self.motors["paddles"]
        print("enabled {}".format( self.enable()))
    
    def tank(self, left, right, normalised = True):
        if self.Wheels is not None:
            self.Wheels["left"].setGoalSpeed(left, normalised)
            self.Wheels["right"].setGoalSpeed(right, normalised)
            
