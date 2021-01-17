import argparse
import sys
from configparser import ConfigParser
from typing import Any, Type
from smbus2 import SMBus

from ...components.sensor import Sensor, Sensors
from ...components.command import Command, Commands

def register_command(command: Command):
    commands[command.name] = command

def register_sensor_plugin(sensor: Sensor):
    sensor_plugins[sensor.name] = sensor

commands = {}
sensor_plugins = {}