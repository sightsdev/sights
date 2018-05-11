#!/usr/bin/env python3

from pyax12.connection import Connection
import time
import websockets
import asyncio
import subprocess, os
import json
import math

AXIS_THRESHOLD = 8689 / 32767.0
speed_factor = 1024

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)

# Ignore, Ben put the servos in the wrong place
# 1 - Front Left
# 2 - Front Right
# 3 - Back Left
# 4 - Back Right

def setup_servo(dynamixel_id):
	# Set the "wheel mode"
	sc.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
	sc.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)
	
def move_left_side(speed):
	sc.set_speed(3, speed)
	#sc.set_speed(4, -speed)
	
def move_right_side(speed):
	#sc.set_speed(1, -speed)
	sc.set_speed(2, speed)
	
def steering(x, y):
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

	left *= speed_factor
	right *= speed_factor

	left = round(left)
	right = round(right)

	if (left < 0):
		left *= -1
		left += 1024
	if (right < 0):
		right *= -1
		right += 1024

	print("Left:", left)
	print("Right:", right)

	move_left_side(left)
	move_right_side(right)

@asyncio.coroutine
def run(websocket, path):
	while True:
		buf = yield from websocket.recv()
		#print(buf)
		if len(buf) > 0:
			msg = json.loads(buf)
			steering(float(msg["left_axis_x"]), float(msg["left_axis_y"]))
			
def main():
	start_server = websockets.serve(run, "10.0.2.4", 5555)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()