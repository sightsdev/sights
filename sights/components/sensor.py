import argparse
from dataclasses import dataclass, field
from typing import Callable, List, Any

@dataclass
class SensorPlugin:
    name: str
    description: str
    sensor_class: Any
    config_class: Any
    info: dict = field(init=False)

class Sensor:
    enabled = True

    def enable(self):
        enabled = True

    def disable(self):
        enabled = False

SensorPlugins = List[SensorPlugin]
