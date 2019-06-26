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
            "left":MotorGroup({
                    "front":AX12A(1, portHandler, baudrate=baud, driveMode="Wheel"),
                    "back":AX12A(3, portHandler, baudrate=baud, driveMode="Wheel"),
                    }),
            "right":MotorGroup({
                    "front":AX12A(2, portHandler, baudrate=baud,reverse = True, driveMode="Wheel"),
                    "back":AX12A(4, portHandler, baudrate=baud, reverse=True, driveMode="Wheel"),
                    })
            })
    
    def __init__(self, port="/dev/ttyUSB0",  baudrate=1000000, arm=False, wheels=False):
        super().__init__(dict(), port, baudrate)
        if arm:
            self.motors.addMotor("arm", self.__Arm__(self.portHandler, baudrate))
            self.Arm = self.motors["arm"]
        if wheels:
            self.motors.addMotor("wheels", self.__Wheels__(self.portHandler, baudrate))
            self.Wheels = self.motors["wheels"]
        print("enabled {}".format( self.enable()))
    
    def tank(self, left, right, normalised = True):
        if self.Wheels is not None:
            self.Wheels["left"].setGoalSpeed(left, normalised)
            self.Wheels["right"].setGoalSpeed(right, normalised)
            
