#!/usr/bin/env python3

from pyax12.connection import Connection
from enum import IntEnum
import time
import websockets
import asyncio
import subprocess, os
import json
import math

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)
start_time = time.time()

AXIS_THRESHOLD = 8689 / 32767.0

class Servo(IntEnum):
    LEFT_FRONT = 1
    RIGHT_FRONT = 2
    LEFT_BACK = 3
    RIGHT_BACK = 4

last_left = 0
last_right = 0

speed_factor = 512
axis_control = "none"

def setup_servo(dynamixel_id):
	# Set the "wheel mode"
	sc.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
	sc.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)
	
def move(left, right):
	if (axis_control == "none"):
		# Left side
		sc.set_speed(servo_left_front_id, left)
		sc.set_speed(servo_left_back_id, left)
		# Right side
		sc.set_speed(servo_right_front_id, right)
		sc.set_speed(servo_right_back_id, right)
	elif (axis_control == "front"):
		# Left side
		sc.set_speed(servo_left_front_id, left)
		sc.set_speed(servo_left_back_id, 0)
		# Right side
		sc.set_speed(servo_right_front_id, right)
		sc.set_speed(servo_right_back_id, 0)
	elif (axis_control == "back"):
		# Left side
		sc.set_speed(servo_left_front_id, 0)
		sc.set_speed(servo_left_back_id, left)
		# Right side
		sc.set_speed(servo_right_front_id, 0)
		sc.set_speed(servo_right_back_id, right)
	
def steering(x, y):
	global last_left
	global last_right
	y *= -1
	x *= -1

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
		
	#print("L:", left, "R:", right)
	
	# Only send message if it's different to the last one
	if (left != last_left and right != last_right):
		move(left, right)
	
	# Store this message for comparison next time
	last_left = left
	last_right = right

def tank_control(left_trigger, right_trigger, left_bumper, right_bumper):
	global last_left
	global last_right

	if (left_bumper): 
		# Left bumper (left side backwards) take priority over trigger (forwards)
		left = -512
	else: # Bumper not pressed, so we will use the trigger
		# Multiply by speed_factor to get our final speed to be sent to the servos
		left = left_trigger * speed_factor
		

	if (right_bumper): 
		# Right bumper (right side backwards)
		right = -512
	else: 
		# Multiply by speed_factor to get our final speed to be sent to the servos
		right = right_trigger * speed_factor
		

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
		
	#print("L:", left, "R:", right)
	
	if (left != last_left):
		sc.set_speed(servo_left_front_id, left)
		sc.set_speed(servo_left_back_id, left)
	if (right != last_right):
		sc.set_speed(servo_right_front_id, right)
		sc.set_speed(servo_right_back_id, right)
	
	# Only send message if it's different to the last one
	#if (left != last_left or right != last_right):
	#	move(left, right)
	
	# Store this message for comparison next time
	last_left = left
	last_right = right

def parseJSON(buf):
	# Convert string data to object
	msg = json.loads(buf)

	# TODO: store as class object rather than dict
	obj = {}
	obj["left_axis_x"] = float(msg["left_axis_x"])
	obj["left_axis_y"] = float(msg["left_axis_y"])
	obj["last_dpad"] = str(msg["last_dpad"])
	obj["button_LS"] = bool(msg["button_LS"])
	obj["button_A"] = bool(msg["button_A"])
	obj["button_B"] = bool(msg["button_B"])
	obj["button_X"] = bool(msg["button_X"])
	obj["button_Y"] = bool(msg["button_Y"])
	obj["right_trigger"] = float(msg["right_trigger"])
	obj["right_bumper"] = bool(msg["right_bumper"])
	obj["left_trigger"] = float(msg["left_trigger"])
	obj["left_bumper"] = bool(msg["left_bumper"])

	return obj

def controlHandler (msg):
	# Set whether it should be normal, front only or back only
	global axis_control
	axis_control = msg["last_dpad"]
	# Play warthog noise thing, coutesy of Graham
	#if (msg["button_LS"] and not audio.playing):
	#	audio.play("warthog.wav")
	# Handle face buttons
	global speed_factor
	if (msg["button_A"]):
		speed_factor = 1000
	elif (msg["button_B"]):
		speed_factor = 500
	# Handle various methods of controlling movement
	x = msg["left_axis_x"] * -1
	y = msg["left_axis_y"] * -1
	if (x < -AXIS_THRESHOLD or x > AXIS_THRESHOLD or y < -AXIS_THRESHOLD or y > AXIS_THRESHOLD):
		steering(msg["left_axis_x"], msg["left_axis_y"])
	else:
		tank_control(msg["left_trigger"], msg["right_trigger"], msg["left_bumper"], msg["right_bumper"])
	
async def recieveControlData(websocket, path):
	while True:
		# Recieve JSON formatted string from websockets
		buf = await websocket.recv()
		if len(buf) > 0:
			# Convert string data to object and then handle controls
			controlHandler(parseJSON(buf))
			
def main():
	print("Starting control data reciever")
	start_server = websockets.serve(recieveControlData, "10.0.2.4", 5555)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()
