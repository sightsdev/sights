import argparse
from dataclasses import dataclass
from typing import Callable, List, Any

@dataclass
class Sensor:
    name: str
    description: str
    sensor_class: Any
    config_class: Any

Sensors = List[Sensor]