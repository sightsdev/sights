import argparse
import sys
from configparser import ConfigParser
from typing import Any, Type
from smbus2 import SMBus

from ...components.sensor import Sensor, Sensors

def register_sensor_plugin(sensor: Sensor):
    sensor_plugins[sensor.name] = sensor

def create_sensor(sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensor_plugins[sensor["type"]]
    # create the appropriate configuration class with the args defined in the config file
    config = plugin.config_class(**sensor["config"])
    # Retrieve an instance of the sensor class with dependencies injected
    sensors[sensor["id"]] = plugin.sensor_class(config)

def get_sensor_data(id): 
    return sensors[id].get()

sensor_plugins = {}
sensors = {}