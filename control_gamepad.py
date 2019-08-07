#!/usr/bin/env python3
from pyax12.connection import Connection
from enum import IntEnum
import time
import websockets
import asyncio
import subprocess, os
import json
import math
import atexit
import configparser
from servo_party import ServoParty

# Load config file
config = configparser.ConfigParser()
config.read('robot.cfg')

# Servos
servo_party = ServoParty();

# Controller state object
state = {}
state["LEFT_STICK_X"] = 0.0;
state["LEFT_STICK_Y"] = 0.0;

# Initial start time
start_time = time.time()

# Controller stick threshold
AXIS_THRESHOLD = 8689 / 32767.0

# When script exits or is interrupted stop all servos
atexit.register(servo_party.stop)

def steering(x, y):
	y *= -1
	x *= -1

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
	left *= servo_party.speed_factor
	right *= servo_party.speed_factor

	# Make sure we don't have any decimals
	left = round(left)
	right = round(right)

	# Different motors need to spin in different directions. We account for that here.	
	if (left < 0):
		left *= -1
		left += 1024
	if (right < 0):
		right *= -1
	elif right < 1024:
		right += 1024
	
	# Only send message if it's different to the last one
	if (left != servo_party.last_left and right != servo_party.last_right):
		#print(left, ",", right)
		servo_party.move_raw(left, right)
	
	# Store this message for comparison next time
	servo_party.last_left = left
	servo_party.last_right = right

def tank_control(left_trigger, right_trigger, left_bumper, right_bumper):

	if (left_bumper): 
		# Left bumper (left side backwards) take priority over trigger (forwards)
		left = -512
	else: # Bumper not pressed, so we will use the trigger
		# Multiply by speed_factor to get our final speed to be sent to the servos
		left = left_trigger * servo_party.speed_factor

	if (right_bumper): 
		# Right bumper (right side backwards)
		right = -512
	else: 
		# Multiply by speed_factor to get our final speed to be sent to the servos
		right = right_trigger * servo_party.speed_factor

	# Make sure we don't have any decimals
	left = round(left)
	right = round(right)

	# The servos use 0 - 1023 as clockwise and 1024 - 2048 as counter clockwise, we account for that here
	if (left < 0):
		left *= -1
		left += 1024
	if (right < 0):
		right *= -1
	else:
		right += 1024
		
	# Only send message if it's different to the last one
	if (left != servo_party.last_left):
		servo_party.move_raw_left(left)
	if (right != servo_party.last_right):
		servo_party.move_raw_right(right)
	
	# Store this message for comparison next time
	servo_party.last_left = left
	servo_party.last_right = right

def controlHandler (buf):
	msg = json.loads(buf)

	control = msg["control"]
	typ = msg["type"]
	# If axis, store as float
	if (typ == "axis"):
		value = float(msg["state"])
	else: # type == "button"
		value = msg["state"]

	# Update state with new value of axis
	state[control] = value

	steering(state["LEFT_STICK_X"], state["LEFT_STICK_Y"])
	#tank_control(msg["LEFT_BOTTOM_SHOULDER"], msg["RIGHT_BOTTOM_SHOULDER"], msg["LEFT_TOP_SHOULDER"], msg["RIGHT_TOP_SHOULDER"])
	
async def recieveControlData(websocket, path):
	while True:
		# Recieve JSON formatted string from websockets
		buf = await websocket.recv()
		if len(buf) > 0:
			if config['debug'].getboolean('debug_printout'):
				print (buf)
			# Convert string data to object and then handle controls
			controlHandler(buf)
			
def main():
	print("Starting control data reciever")
	start_server = websockets.serve(recieveControlData, config['network']['ip'], 5555)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()
