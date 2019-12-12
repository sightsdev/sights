#!/usr/bin/env python3
# -*- coding: utf-8 -*-
''' Clears overheating errors and reenables motors '''
from pyax12.connection import Connection
from argparse import ArgumentParser
import json

port = "/dev/ttyACM0"
baudrate = 1000000

# Setup argument parser for config file loading
parser = ArgumentParser()
# Create argument for config file
parser.add_argument("-p", "--port", 
                    dest="port", 
                    help="serial port for Dynamixel interface", 
                    metavar="<port>", 
                    default=port)
parser.add_argument("-b", "--baudrate", 
                    dest="baudrate", 
                    help="baudrate to connect at", 
                    metavar="<baudrate>", 
                    default=baudrate)
# Actually parse the arguments
args = parser.parse_args()

# Open connection
print(f"Opening connection at {port} with baudrate of {baudrate}")
sc = Connection(port=port, baudrate=baudrate)

# Clear overheating errors and renable torque or something like that
sc.write_data(4, 0x18, 0)
sc.write_data(3, 0x18, 0)
sc.write_data(4, 0x0E, [0xFF, 0x03])
sc.write_data(3, 0x0E, [0xFF, 0x03])
sc.write_data(4, 0x22, [0xFF, 0x03])
sc.write_data(3, 0x22, [0xFF, 0x03])

# Close the connection
sc.close()