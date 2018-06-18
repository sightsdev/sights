#!/usr/bin/env python3

from pyax12.connection import Connection
import time
import websockets
import asyncio
import subprocess, os
import json
import math

AXIS_THRESHOLD = 8689 / 32767.0
speed_factor = 1000

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)

last_left = 0
last_right = 0

servo_left_front_id = 3
servo_right_front_id = 2
servo_left_back_id = 1
servo_right_back_id = 4

axis_control = "none"

def setup_servo(dynamixel_id):
	# Set the "wheel mode"
	sc.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
	sc.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)
	
def move(left, right):
	if (axis_control == "none"):
		sc.set_speed(servo_left_front_id, left)
		sc.set_speed(servo_left_back_id, left)
		sc.set_speed(servo_right_front_id, right)
		sc.set_speed(servo_right_back_id, right)
	elif (axis_control == "front"):
		sc.set_speed(servo_left_front_id, left)
		sc.set_speed(servo_left_back_id, 0)
		sc.set_speed(servo_right_front_id, right)
		sc.set_speed(servo_right_back_id, 0)
	elif (axis_control == "back"):
		sc.set_speed(servo_left_front_id, 0)
		sc.set_speed(servo_left_back_id, left)
		sc.set_speed(servo_right_front_id, 0)
		sc.set_speed(servo_right_back_id, right)
		
def move_left_side(speed):
	if (axis_control == "none"):
		sc.set_speed(servo_left_front_id, speed)
		sc.set_speed(servo_left_back_id, speed)
	elif (axis_control == "front"):
		sc.set_speed(servo_left_front_id, speed)
		sc.set_speed(servo_left_back_id, 0)
	elif (axis_control == "back"):
		sc.set_speed(servo_left_front_id, 0)
		sc.set_speed(servo_left_back_id, speed)
	
def move_right_side(speed):
	if (axis_control == "none"):
		sc.set_speed(servo_right_front_id, speed)
		sc.set_speed(servo_right_back_id, speed)
	elif (axis_control == "front"):
		sc.set_speed(servo_right_front_id, speed)
		sc.set_speed(servo_right_back_id, 0)
	elif (axis_control == "back"):
		sc.set_speed(servo_right_front_id, 0)
		sc.set_speed(servo_right_back_id, speed)
	
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
	
	# Only send message if it's different to the last one
	if (left != last_left and right != last_right):
		move_left_side(left)
		move_right_side(right)
	
	# Store this message for comparison next time
	last_left = left
	last_right = right

def tank_control(left_trigger, right_trigger, left_bumper, right_bumper):
	global last_left
	global last_right

	if (left_bumper):
		# Left bumper (left side backwards) take priority over trigger (forwards)
		left = speed_factor
	else:
		# Multiply by speed_factor to get our final speed to be sent to the servos
		left = left_trigger *= speed_factor

	if (right_bumper):
		# Right bumper (right side backwards)
		right = speed_factor
	else:
		# Bumper not pressed, so we will use the trigger
		# Multiply by speed_factor to get our final speed to be sent to the servos
		right = right_trigger *= speed_factor

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
	if (left != last_left and right != last_right):
		move_left_side(left)
		move_right_side(right)
	
	# Store this message for comparison next time
	last_left = left
	last_right = right

@asyncio.coroutine
def run(websocket, path):
	while True:
		buf = yield from websocket.recv()
		#print(buf)
		if len(buf) > 0:
			# Convert string data to object
			msg = json.loads(buf)
			# Set whether it should be normal, front only or back only
			axis_control = msg["last_dpad"]

			if (bool(msg["button_L3"]) and not audio.playing):
				audio.play("warthog.wav")

			if (bool(msg["button_A"])):
				speed_factor = 1000
			elif (bool (msg["button_B"])):
				speed_factor = 500

			tank_control(float(msg["left_trigger"]), float(msg["right_trigger"]), bool(msg["left_bumper"]), bool(msg["right_bumper"]))
			steering(float(msg["left_axis_x"]), float(msg["left_axis_y"]))
			
def main():
	start_server = websockets.serve(run, "10.0.2.4", 5555)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()