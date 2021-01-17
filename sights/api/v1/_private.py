import argparse
import sys
from configparser import ConfigParser
from typing import Any, Type
from smbus2 import SMBus

from ...components.sensor import Sensor, Sensors

def register_sensor_plugin(sensor: Sensor):
    sensor_plugins[sensor.name] = sensor

sensor_plugins = {}