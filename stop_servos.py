#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pyax12.connection import Connection
import pyax12.packet as pk
import serial
import configparser

config = configparser.ConfigParser()
config.read('robot.cfg')

sc = Connection(port=config['servo']['port'], baudrate=1000000)

sc.set_speed(1, 0)
sc.set_speed(2, 0)
sc.set_speed(3, 0)
sc.set_speed(4, 0)
sc.close()
