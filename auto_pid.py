#!/usr/bin/env python3
from pyax12.connection import Connection
from serial import Serial
from enum import IntEnum
from servo_party import ServoParty
import time

# Servos
servo_party = ServoParty();
# Arduino
sc_arduino = Serial(port="/dev/ttyACM1", baudrate=115200)

# PID constants
K_p = 0
K_i = 0
K_d = 0

class Distance(IntEnum):
    FRONT = 0
    LEFT = 1
    RIGHT = 2
    BACK = 3

def getData():
	buf = sc_arduino.readline().decode("UTF-8")
	# If string begins with "D:", it's distance
	msg = {}
	if (buf[0] == "D"):
		# Strip leading "D:" and split by comma
		msg["dist"] = buf[2:-3].split(",")
	return msg

def main():
	integral = 0
	last_error = 0
	current_time = time.time()
	last_time = current_time

	while True:
		msg = getData()
		if not msg = {}:
			# Get the four distances
			front = int(msg["dist"][Distance.FRONT])
			back = int(msg["dist"][Distance.BACK])
			left = int(msg["dist"][Distance.LEFT])
			right = int(msg["dist"][Distance.RIGHT])

			# Get current time
			current_time = time.time()
			# Change in time since last loop
			delta_time = current_time - last_time
			
			# Our setpoint (SP) is 0, as we want the difference between the two sides to be 0. This is our target value.
			# Therefore, because our SP is 0, our current measured value is the same as the error which is difference between left and right
			error = left - right
			# Work out the change in error since the last loop
			delta_error = error - last_error

			# Our integral is the sum of all previous errors taking into account time
			integral += error * delta_time

			# Our derivative is the difference between this error and the last
			derivative = 0
			if (delta_time > 0): # Generally we try to avoid dividing by zero
				derivative = delta_error / delta_time

			# Each of our parameters are now multiplied by their respective constants
			pid = (K_p * error) + (K_i * integral) + (K_d * derivative)

			# Update last_error to the current error
			last_error = error
			# Update last_time
			last_time = current_time

if __name__ == '__main__':
	main()
 
