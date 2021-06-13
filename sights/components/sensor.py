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

    def enable(self):
        self.enabled = True

    def disable(self):
        self.enabled = False

sensor_plugins: dict[SensorPlugin] = {}