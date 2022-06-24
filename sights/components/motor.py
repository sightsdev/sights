from dataclasses import dataclass, field
from typing import Any
import logging

@dataclass
class MotorPlugin:
    name: str
    description: str
    connection_class: Any
    connection_config: Any
    motor_class: Any
    motor_config: Any
    channels: int
    info: dict = field(init=False)

@dataclass
class ConnectionConfig:
    id: int

class Connection:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        self.config = config

    # We call the configure function using Python's built in __post_init__ method
    def __post_init__(self):
        self.configure(self)
        
    # The main initialization method that is called after the object has been created
    def configure(self):
        pass

    def stop(self):
        pass

    def close(self):
        pass

@dataclass
class MotorConfig:
    id: int
    enabled: bool

class Motor:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        self.config = config

    # We call the configure function using Python's built in __post_init__ method
    def __post_init__(self):
        self.configure(self)

    # The main initialization method that is called after the object has been created
    def configure(self):
        pass

    def enable(self):
        self.config.enabled = True

    def disable(self):
        self.config.enabled = False

    def set_speed(self, speed):
        pass

    def stop(self):
        pass

    def set_position(self, pos):
        pass
