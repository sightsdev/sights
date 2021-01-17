# This file contains the classes, functions and constants
# that can be used by plugins.

from ...components.sensor import Sensor
from ...components.command import Command
from ._private import register_sensor, register_command, register_component
from smbus2 import SMBus  # Injectable

from ...components.randomservice import RandomService  # Injectable