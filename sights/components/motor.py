import argparse
from dataclasses import dataclass, field
from typing import Callable, List, Any
import logging


@dataclass
class MotorPlugin:
    name: str
    description: str
    connection_class: Any
    motor_class: Any
    channels: int
    info: dict = field(init=False)


class MotorConnection:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)

    def move_raw(self, left=None, right=None):
        pass

    def stop(self):
        pass

    def close(self):
        pass


class Motor:
    enabled = True

    def enable(self):
        self.enabled = True

    def disable(self):
        self.enabled = False


motor_plugins: dict[MotorPlugin] = {}
motors: dict[Motor] = {}
motor_connection: list[MotorConnection] = []
