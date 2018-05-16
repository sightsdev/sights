#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pyax12.connection import Connection
import pyax12.packet as pk
import serial

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)

sc.set_speed(1, 0)
sc.set_speed(2, 0)
sc.set_speed(3, 0)
sc.set_speed(4, 0)
sc.close()
