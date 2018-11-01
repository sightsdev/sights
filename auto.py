#!/usr/bin/env python3
from pyax12.connection import Connection
from enum import IntEnum
from serial import Serial
from servo_party import ServoParty

# Servos
servo_party = ServoParty();
# Arduino
sc_arduino = Serial(port="/dev/ttyACM1", baudrate=115200)

speed = 300

class Distance(IntEnum):
    FRONT = 0
    LEFT = 1
    RIGHT = 2
    BACK = 3

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
		if (not msg == {}):
			front = int(msg["dist"][Distance.FRONT])
			back = int(msg["dist"][Distance.BACK])
			
			if (abs(front - back) <= 50):
				servo_party.move(0, 0)
			elif (front < back):
				servo_party.move(-speed, -speed)
			elif (front > back):
				servo_party.move(speed, speed)

if __name__ == '__main__':
	main()
 
