#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pyax12.connection import Connection
import json

# Load config file
config = json.load(open('robot.json'))

# Open connection
sc = Connection(port=config['servo']['port'], baudrate=config['servo']['baudrate'])

# Set all motors to zero
sc.set_speed(1, 0)
sc.set_speed(2, 0)
sc.set_speed(3, 0)
sc.set_speed(4, 0)

# Close the connection
sc.close()
