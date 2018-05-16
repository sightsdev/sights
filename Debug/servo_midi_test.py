#!/usr/bin/env python3

from pyax12.connection import Connection
import time
import subprocess, os
import sys
import mido

sc = Connection(port="COM5", baudrate=1000000)

def setup_servo(dynamixel_id):
	# Set the "wheel mode"
	sc.set_cw_angle_limit(dynamixel_id, 0, degrees=False)
	sc.set_ccw_angle_limit(dynamixel_id, 0, degrees=False)

if len(sys.argv) > 1:
    portname = sys.argv[1]
else:
    portname = None  # Use default port

try:
    with mido.open_input(portname) as port:
        print('Using {}'.format(port))
        print('Waiting for messages...')
        for message in port:
            #print('Received {}'.format(message))
            if (message.type == "control_change"):
                if (message.control == 41):
                    sc.set_speed(1, message.value * 8)
                if (message.control == 42):
                    sc.set_speed(2, 1024 + message.value * 8)
                if (message.control == 43):
                    sc.set_speed(3, message.value * 8)
                if (message.control == 44):
                    sc.set_speed(4, 1024 + message.value * 8)
            sys.stdout.flush()
except KeyboardInterrupt:
    pass