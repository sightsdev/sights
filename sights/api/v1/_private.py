import argparse
import sys
from configparser import ConfigParser
from typing import Any, Type

import cargo

from ...sensor import Sensor
from ...command import Command
from ...components.sensors import Sensors
from ...components.commands import Commands

def create_container():
    _container = cargo.containers.Standard()

    _container[Commands] = []
    _container[Sensors] = []

    return _container


def register_command(command: Command):
    commands[command.name] = command
    container[Commands].append(command)
    container[command.handler_class] = command.handler_class


def register_sensor(sensor: Sensor):
    sensors[sensor.name] = sensor
    container[Sensors].append(sensor)
    container[sensor.handler_class] = sensor.handler_class



def register_component(interface: Type, constructor: Any):
    container[interface] = constructor


commands = {}
sensors = {}
container = create_container()