from sights.api import v1 as api
from sights.components.sensor import *
from dataclasses import dataclass
import random

@dataclass
class RandomSensorConfig:
    minimum: int
    maximum: int

class RandomSensor(Sensor):
    def __init__(self, config):
        self.minimum = int(config.minimum)
        self.maximum = int(config.maximum)

    def get(self):
        return random.randint(self.minimum, self.maximum)

plugin = api.SensorPlugin(
    name="RandomSensor", 
    description="RandomSensor", 
    sensor_class=RandomSensor, 
    config_class=RandomSensorConfig
)

api.plugins.register_sensor_plugin(plugin)
