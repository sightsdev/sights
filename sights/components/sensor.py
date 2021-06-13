import argparse
from dataclasses import dataclass, field
from typing import Callable, List, Any

@dataclass
class SensorPlugin:
    name: str
    description: str
    sensor_class: Any
    config_class: Any
    info: dict = field(default_factory=dict)

class Sensor:
    enabled = True

    def enable(self):
        self.enabled = True

    def disable(self):
        self.enabled = False

class SensorConfig:
    id: int

sensor_plugins: dict[SensorPlugin] = {}
sensors: dict[Sensor] = {}