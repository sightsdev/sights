#!/usr/bin/env python3
from pyax12.connection import Connection
from enum import IntEnum
import serial

# Servos
sc = Connection(port="/dev/ttyACM0", baudrate=1000000)
# Arduino
ser = serial.Serial("/dev/ttyACM1", 115200)

class Servo(IntEnum):
    LEFT_FRONT = 1
    RIGHT_FRONT = 2
    LEFT_BACK = 3
    RIGHT_BACK = 4

class Distance(IntEnum):
    FRONT = 0
    LEFT = 1
    RIGHT = 2
    BACK = 3
    
def move_servos(left, right):
    # Left side
    sc.set_speed(Servo.LEFT_FRONT, left)
    sc.set_speed(Servo.LEFT_BACK, left)
    # Right side
    sc.set_speed(Servo.RIGHT_FRONT, right)
    sc.set_speed(Servo.RIGHT_BACK, right)

def move(left, right):
	global last_left
	global last_right

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
		move_servos(left, right)
	
	# Store this message for comparison next time
	last_left = left
	last_right = right

def getData():
	buf = ser.readline().decode("UTF-8")
	# If string begins with "D:", it's distance
	msg = {}
	if (buf[0] == "D"):
		# Strip leading "D:" and split by comma
		msg["dist"] = buf[2:-3].split(",")
    return msg

def main():
	while True:
        msg = getData()
        if (msg[Distance.FRONT] < msg[Distance.BACK]):
            move(300, 300)
        else if (msg[Distance.FRONT] > msg[Distance.BACK]):
            move(-300, -300)

if __name__ == '__main__':
	main()
 
