#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pyax12.connection import Connection
import json

# Load config file
f = open('robot.json')
config = json.load(f)

sc = Connection(port=config['servo']['port'], baudrate=config['servo']['baudrate'])

sc.set_speed(1, 0)
sc.set_speed(2, 0)
sc.set_speed(3, 0)
sc.set_speed(4, 0)
sc.close()
