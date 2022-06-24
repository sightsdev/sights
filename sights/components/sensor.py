from dataclasses import dataclass, field
from typing import Any
import logging 

@dataclass
class SensorPlugin:
    name: str
    description: str
    sensor_class: Any
    sensor_config: Any
    info: dict = field(default_factory=dict)

@dataclass
class SensorConfig:
    id: int
    enabled: bool

# Base class for sensor
class Sensor():
    def __init__(self, config):
        self.logger = logging.getLogger(__name__)
        self.config = config

    # We call the configure function using Python's built in __post_init__ method
    def __post_init__(self):
        self.configure(self)
        
    # The main initialization method that is called after the object has been created
    # Should be overriden by the inheriting class
    def configure(self):
        pass

    def enable(self):
        self.config.enabled = True

    def disable(self):
        self.config.enabled = False
