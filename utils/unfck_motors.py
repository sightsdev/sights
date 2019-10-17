#!/usr/bin/env python3
# -*- coding: utf-8 -*-
''' Clears overheating errors and reenables motors '''
from pyax12.connection import Connection
from argparse import ArgumentParser
import json

# Setup argument parser for config file loading
parser = ArgumentParser()
# Create argument for config file
parser.add_argument("-c", "--config", 
                    dest="config_file", 
                    help="load specified configuration file", 
                    metavar="<file>", 
                    default=path+"/opt/sart/SARTRobot/configs/default.json")
# Actually parse the arguments
args = parser.parse_args()

# Load config file
config = json.load(open(args.config_file))

# Open connection
sc = Connection(port=config['servo']['port'], baudrate=config['servo']['baudrate'])

# Clear overheating errors and renable torque or something like that
sc.write_data(4, 0x18, 0)
sc.write_data(3, 0x18, 0)
sc.write_data(4, 0x0E, [0xFF, 0x03])
sc.write_data(3, 0x0E, [0xFF, 0x03])
sc.write_data(4, 0x22, [0xFF, 0x03])
sc.write_data(3, 0x22, [0xFF, 0x03])

# Close the connection
sc.close()