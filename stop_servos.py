#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pyax12.connection import Connection
from ruamel.yaml import YAML

f = open("robot.yaml").read()
config = YAML(typ='safe').load(f)

sc = Connection(port=config['servo']['port'], baudrate=config['servo']['baudrate'])

sc.set_speed(1, 0)
sc.set_speed(2, 0)
sc.set_speed(3, 0)
sc.set_speed(4, 0)
sc.close()
