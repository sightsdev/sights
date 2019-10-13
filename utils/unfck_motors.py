#!/usr/bin/env python3
# -*- coding: utf-8 -*-
''' Clears overheating errors and reenables motors '''
from pyax12.connection import Connection
import json

# Load config file
config = json.load(open('robot.json'))

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