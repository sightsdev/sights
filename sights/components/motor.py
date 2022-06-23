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

    # The main initialization method that is called after the object has been created
    def configure(self):
        pass
    
    # We call the configure function using Python's built in __post_init__ method
    def __post_init__(self):
        self.configure(self)

    def stop(self):
        pass

    def close(self):
        pass

@dataclass
class Motor:
    id: int
    enabled: bool

    # The main initialization method that is called after the object has been created
    def configure(self):
        pass
    
    # We call the configure function using Python's built in __post_init__ method
    def __post_init__(self):
        self.configure(self)

    def enable(self):
        self.enabled = True

    def disable(self):
        self.enabled = False

    def set_speed(self):
        pass

    def set_position(self):
        pass

@dataclass
class MotorConfig:
    id: int
    enabled: bool