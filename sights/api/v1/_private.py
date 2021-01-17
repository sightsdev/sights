import argparse
import sys
from configparser import ConfigParser
from typing import Any, Type
from smbus2 import SMBus
import cargo

from ...components.i2cbus import i2cbus
from ...components.sensor import Sensor, Sensors
from ...components.command import Command, Commands
from ...components.randomservice import RandomService

def create_container():
    _container = cargo.containers.Standard()

    # format:
    # _container[<Type>] = <Instance>
    _container[Commands] = []
    _container[Sensors] = []
    _container[SMBus] = i2cbus
    _container[RandomService] = RandomService

    return _container

def register_command(command: Command):
    commands[command.name] = command
    container[Commands].append(command)
    container[command.handler_class] = command.handler_class

def register_sensor(sensor: Sensor):
    sensors[sensor.name] = sensor
    container[Sensors].append(sensor)
    container[sensor.sensor_class] = sensor.sensor_class

def register_component(interface: Type, constructor: Any):
    container[interface] = constructor

commands = {}
sensors = {}
container = create_container()