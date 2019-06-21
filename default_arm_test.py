#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Mon May 20 23:58:14 2019

@author: sart
"""
import time
import threading
from dynamixel_sdk import *
from Motors import DxlXL430W250T as Motor
from Motors import MotorGroup
from math import sin, pi
portHandler = PortHandler("/dev/ttyUSB0")
packetHandler = PacketHandler(2.0)

FLAG_QUIT = False
toQuit=["\n", "\r", "", "quit", "q"]

def quitOn():
    global FLAG_QUIT
    global toQuit
    while 1:
        key=input("")
        if key in toQuit:
            FLAG_QUIT = True
            print(("quitting on %s" % key))
            break

if portHandler.openPort():
    print("Succeeded to open the port")
else:
    print("Failed to open the port")
    print("Press any key to terminate...")
    getch()
    quit()


# Set port baudrate
if portHandler.setBaudRate(57600):
    print("Succeeded to change the baudrate")
else: 
    print("Failed to change the baudrate")
    print("Press any key to terminate...")
    getch()
    quit()

motor2 = Motor(2, portHandler, packetHandler)
motor9 = Motor(9, portHandler, packetHandler, reverse=True)

motor4 = Motor(4, portHandler, packetHandler)
motor5 = Motor(5, portHandler, packetHandler, reverse=True)

motor6 = Motor(6, portHandler, packetHandler, reverse=True)
motor7 = Motor(7, portHandler, packetHandler, reverse=True)

motor8 = Motor(8, portHandler, packetHandler, reverse=True)

shoulder = MotorGroup([motor2, motor9])
elbow = MotorGroup([motor4, motor5])

allMotors = MotorGroup([shoulder, elbow, motor6, motor7, motor8])



print(("OP MODE: %s" % allMotors.read(allMotors.OPERATING_MODE)))
allMotors.disable()
print(("SET BOUNDS: %s" % allMotors.setPosBounds(-95, 95)))
#print("ENABLED: %s" % allMotors.enable())



#shoulder.setGoalPos(0)
#elbow.setGoalPos(0)
#motor6.setGoalPos(45)
#motor7.setGoalPos(0)
motor7.enable()
shoulder.enable()
elbow.enable()


positions = [-90, 0, 90]
index = 0

def seconds():
    return int(time.time())

tm1 = seconds()
print(("\n"+("-"*20)+"\n"))
print((allMotors.getGoalPos(False)))
print((allMotors.currentPos(False)))

quitter = threading.Thread(target=quitOn)
quitter.start()
try:
    while 1:
        if(seconds()-tm1>=4):
#            index = (index+1)%len(positions)
            motor7.setGoalPos(45)
            elbow.setGoalPos(45)
            shoulder.setGoalPos(0)
            print(("\n"+("-"*20)+"\n"))
            print(("Goal Pos: %s" % allMotors.getGoalPos(False)))
            print(("Pos: %s" % allMotors.currentPos(False)))
            print(("ENABLED: %s" % allMotors.read(allMotors.TORQUE_ENABLE)))
            print(("DRIVE MODE: %s" % allMotors.read(allMotors.DRIVE_MODE)))
            tm1 = seconds()
        
        if allMotors.hasError():
           raise Exception("Dynamixel Error")
        if FLAG_QUIT:
            break

finally:
    if not FLAG_QUIT:
        allMotors.printErrors()
    allMotors.disable()
    portHandler.closePort()
    print("All closed")
    
     