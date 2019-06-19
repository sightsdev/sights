#!/usr/bin/env python3
#from pyax12.connection import Connection
from enum import IntEnum
import time
import websockets
import asyncio
#import subprocess, os
import json
import math
import atexit
#from servo_party import ServoParty
from Controller import XBoxOne
from Robot import Robot
from Motors import MX12W, MotorGroup, XL430W250

class SARTRobot(Robot):
    def __Arm__(self, portHandler, baud):
        return MotorGroup({
            "shoulder":MotorGroup({
                    "left":XL430W250(5, portHandler, baudrate=baud),
                    "right":XL430W250(6, portHandler, baudrate=baud, reverse=True),
                    }), 
            "elbow":MotorGroup({
                    "left":XL430W250(7, portHandler, baudrate=baud),
                    "right":XL430W250(8, portHandler, baudrate=baud, reverse=True),
                    }), 
            "Hand":MotorGroup({
                    "left":XL430W250(9, portHandler, baudrate=baud),
                    "right":XL430W250(10, portHandler, baudrate=baud, reverse=True),
                    }),
            })
    
    def __Wheels__(self, portHandler, baud):
        return MotorGroup({
            "left":MotorGroup({
                    "front":MX12W(1, portHandler, baudrate=baud),
                    "back":MX12W(2, portHandler, baudrate=baud, reverse=True),
                    }),
            "right":MotorGroup({
                    "front":MX12W(3, portHandler, baudrate=baud),
                    "back":MX12W(4, portHandler, baudrate=baud, reverse=True),
                    })
            })
    
    def __init__(self, port="/dev/ttyUSB0",  baudrate="1000000", arm=False, wheels=False):
        super.__init__(self, dict(), port, baudrate)
        if arm:
            self.motors.addMotor("arm", self.__Arm__(self.portHandler, baudrate))
            self.Arm = self.motors["arm"]
        if wheels:
            self.motors.addMotor("wheels", self.__Wheels__(self.portHandler, baudrate))
            self.Wheels = self.motors["wheels"]
    
    def tank(self, left, right, normalised = True):
        if self.Wheels is not None:
            self.Wheels["left"].setGoalSpeed(left, normalised)
            self.Wheels["right"].setGoalSpeed(right, normalised)
            
    

# Servos
#servo_party = ServoParty();

start_time = time.time()

controller = XBoxOne()

# Controller stick threshold
AXIS_THRESHOLD = 8689 / 32767.0

mkIV = SARTRobot(wheels=True) 

# When script exits or is interrupted stop all servos
atexit.register(mkIV.close)


class Modes(IntEnum):
    DRIVE   = 0
    ARM     = 1
    
	
MODE = Modes.DRIVE
speed_factor = 1
last_left = 0
last_right  = 0
    
def steering(x, y):
	global last_left
	global last_right
	global speed_factor
	# Stick deadzone
	if (x > -AXIS_THRESHOLD and x < AXIS_THRESHOLD):
			x = 0
	if (y > -AXIS_THRESHOLD and y < AXIS_THRESHOLD):
			y = 0

	# convert to polar
	r = math.hypot(y, x)
	t = math.atan2(x, y)

	# rotate by 45 degrees
	t += math.pi / 4

	# back to cartesian
	left = r * math.cos(t)
	right = r * math.sin(t)

	# rescale the new coords
	left = left * math.sqrt(2)
	right = right * math.sqrt(2)

	# clamp to -1/+1
	left = max(-1, min(left, 1))
	right = max(-1, min(right, 1))

	# Multiply by speed_factor to get our final speed to be sent to the servos
	left *= speed_factor
	right *= speed_factor

#	# Make sure we don't have any decimals
#	left = round(left)
#	right = round(right)

#	# Different motors need to spin in different directions. We account for that here.	
#	if (left < 0):
#		left *= -1
#		left += 1024
#	if (right < 0):
#		right *= -1
#	elif right < 1024:
#		right += 1024
	
	# Only send message if it's different to the last one
	if (left != last_left and right != last_right):
		mkIV.tank(left, right)
	
	# Store this message for comparison next time
	last_left = left
	last_right = right

def tank_control():
    global last_left
    global last_right
    global speed_factor
    
    left_bumper = controller.bumper_left
    right_bumper = controller.bumper_right
    left_trigger = controller.trigger_left
    right_trigger = controller.trigger_right
    
	
    
    if (left_bumper.pressed): 
		# Left bumper (left side backwards) take priority over trigger (forwards)
        left = -0.5
    else: # Bumper not pressed, so we will use the trigger
		# Multiply by speed_factor to get our final speed to be sent to the servos
        left = left_trigger.pressed * speed_factor

    if (right_bumper.pressed): 
		# Right bumper (right side backwards)
        right = -0.5
    else: 
		# Multiply by speed_factor to get our final speed to be sent to the servos
        right = right_trigger.pressed * speed_factor

#	# Make sure we don't have any decimals
#    left = round(left)
#    right = round(right)

#	# The servos use 0 - 1023 as clockwise and 1024 - 2048 as counter clockwise, we account for that here
#    if (left < 0):
#        left *= -1
#        left += 1024
#    if (right < 0):
#        right *= -1
#    else:
#        right += 1024
		
	# Only send message if it's different to the last one
    if (left != last_left):
        mkIV.Wheels["left"].setGoalSpeed(left, True)
    if (right != last_right):
        mkIV.Wheels["right"].setGoalSpeed(right, True)
	
	# Store this message for comparison next time
    last_left = left
    last_right = right

def armControl():
    pass

def controlHandler ():
    global MODE
    global speed_factor
    if (controller.btn_menu.pressed):
        MODE = (MODE+1)%2
    
    if(MODE is Modes.DRIVE):
    	# Handle face buttons
    	if (controller.btn_a.pressed):
    		speed_factor = 1
    	elif (controller.btn_b.pressed):
    		speed_factor = 0.5
    	# Handle various methods of controlling movement
    	x = controller.joy_left.axis_x -1
    	y = controller.joy_left.axis_y * -1
    	if (x < -AXIS_THRESHOLD or x > AXIS_THRESHOLD or y < -AXIS_THRESHOLD or y > AXIS_THRESHOLD):
    		steering(x, y)
    	else:
    		tank_control()
    elif(MODE is Modes.ARM):
        armControl()
	
async def recieveControlData(websocket, path):
    while True:
		# Recieve JSON formatted string from websockets
        buf = await websocket.recv()
        if len(buf) > 0:
			# Convert string data to object and then handle controls
            controller.update(json.loads(buf))
            controlHandler()
			
def main():
	print("connecting to motors")
	print("connected: {}".format(mkIV.start()))
	print("Starting control data reciever")
	start_server = websockets.serve(recieveControlData, "10.0.2.4", 5555)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()
