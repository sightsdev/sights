import argparse
from dataclasses import dataclass, field
from typing import Callable, List, Any

@dataclass
class SensorPlugin:
    name: str
    description: str
    sensor_class: Any
    info: dict = field(default_factory=dict)

# Base class for sensor
@dataclass
class Sensor():
    enabled: bool = True

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

@dataclass
class SensorConfig:
    enabled: bool