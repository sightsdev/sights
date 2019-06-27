#!/usr/bin/env python3
#from pyax12.connection import Connection
from enum import IntEnum
import time
import websockets
import asyncio
import subprocess, os
import json
import math
#from servo_party import ServoParty
from Controller import XBoxOne
from SARTRobots import MarkIV    

# Servos
#servo_party = ServoParty();

start_time = time.time()

controller = XBoxOne()

# Controller stick threshold
AXIS_THRESHOLD = 8689 / 32767.0

#mkIV = SARTRobot(wheels=True) 
mkIV = MarkIV(arm=True, port="COM11")

# When script exits or is interrupted stop all servos
#atexit.register(mkIV.close) #now part of the robot class


class Modes(IntEnum):
    DRIVE   = 0
    ARM     = 1
    
def toggleMode(mode):
    if mode is Modes.DRIVE:
        mode = Modes.ARM
    else:
        mode = Modes.DRIVE
    print("Mode is now {}".format(mode.name))
    return mode
	
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
        left = left_trigger.axis * speed_factor

    if (right_bumper.pressed): 
		# Right bumper (right side backwards)
        right = -0.5
    else: 
		# Multiply by speed_factor to get our final speed to be sent to the servos
        right = right_trigger.axis * speed_factor


    if (left != last_left):
        mkIV.Wheels["left"].setGoalSpeed(left, True)
    if (right != last_right):
        mkIV.Wheels["right"].setGoalSpeed(right, True)
	
	# Store this message for comparison next time
    last_left = left
    last_right = right

def armControl():
    speed = 100
    left_x, left_y = controller.joy_left.getValid()
    right_x, right_y = controller.joy_right.getValid()
    
    if(left_y != 0):
        current = mkIV.Arm["shoulder"]["right"].currentPos(False)
        if current is not None:
            print("shoulder current: {} change {}".format(current, left_y))
            mkIV.Arm["shoulder"].setGoalPos(current+left_y*speed, False)
    
    if(right_y != 0):
        current = mkIV.Arm["elbow"]["right"].currentPos(False)
        if current is not None:
            print("elbow current: {} change {}".format(current, right_y))
            mkIV.Arm["elbow"].setGoalPos(current+right_y*speed, False)
    
# =============================================================================
#     if(left_x != 0):
#         current = mkIV.Arm["hand"]["wrist"].currentPos(False)
#         if current is not None:
#             print("shoulder current: {} change {}".format(current, left_y))
#             mkIV.Arm["hand"]["wrist"].setGoalPos(current+left_x*speed, False)
# =============================================================================
    
    if(right_x != 0):
        current = mkIV.Arm["hand"].currentPos(False)
        if current is not None:
            print("hand current: {} change {}".format(current, right_x))
            mkIV.Arm["hand"].setGoalPos(current+right_x*speed, False)
        

def controlHandler():
    global MODE
    global speed_factor
    if (controller.btn_x.singlePress() or controller.btn_y.singlePress()):
        if MODE is Modes.DRIVE:
            MODE = Modes.ARM
        else:
            MODE = Modes.DRIVE
        print("Mode is now: {}".format(MODE.name))
    
#    if (controller.dpad.down.singlePress()):
#        conn = mkIV.countConnected()
#        print("were connected: {} out of {}".format(conn[0],conn[1]))
#        mkIV.enable()
#        conn = mkIV.countConnected()
#        print("now connected: {} out of {}".format(conn[0],conn[1]))
    
    if controller.dpad.down.singlePress():
        mkIV.motors.rebootDisconnected()
        conn = mkIV.countConnected()
        print("were connected: {} out of {}".format(conn[0],conn[1]))
        mkIV.enable()
        conn = mkIV.countConnected()
        print("now connected: {} out of {}".format(conn[0],conn[1]))
		
    if controller.dpad.right.singlePress():
        mkIV.Arm["shoulder"].setGoalPos(-90)
        mkIV.Arm["elbow"].setGoalPos(90)
        mkIV.Arm["hand"].setGoalPos(-40)
	
    if controller.dpad.up.singlePress():
        mkIV.Arm["shoulder"].setGoalPos(0)
        mkIV.Arm["elbow"].setGoalPos(0)
        mkIV.Arm["hand"].setGoalPos(-40)
	
    if controller.dpad.left.singlePress():
        mkIV.Arm["shoulder"].setGoalPos(90)
        mkIV.Arm["elbow"].setGoalPos(-90)
        mkIV.Arm["hand"].setGoalPos(-40)
	
        
    
    if(MODE is Modes.DRIVE):
    	# Handle face buttons
    	if (controller.btn_a.singlePress()):
    		speed_factor = 1
    	elif (controller.btn_b.singlePress()):
    		speed_factor = 0.5
    	# Handle various methods of controlling movement
    	x = controller.joy_left.axis_x * -1
    	y = controller.joy_left.axis_y * -1
    	if mkIV.Wheels is not None:
        	if (x < -AXIS_THRESHOLD or x > AXIS_THRESHOLD or y < -AXIS_THRESHOLD or y > AXIS_THRESHOLD):
        		steering(x, y)
        	else:
        		tank_control()
    elif(MODE is Modes.ARM and mkIV.Arm is not None):
        if controller.joy_left.valid() or controller.joy_right.valid():
            armControl()
	
async def recieveControlData(websocket, path):
    while True:
		# Recieve JSON formatted string from websockets
        buf = await websocket.recv()
        if len(buf) > 0:
#            print(buf)
            print("reciving data")
            # Convert string data to object and then handle controls
            controller.updateInputs(json.loads(buf))
            controlHandler()
			
def main():
	print("connecting to motors")
	conn = mkIV.countConnected()
	print("connected: {} out of {}".format(conn[0],conn[1]))
	print("Starting control data reciever")
	mkIV.Arm.setGoalPos(0, True)
	start_server = websockets.serve(recieveControlData, "localhost", 5555)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()
	

if __name__ == '__main__':
    main()
