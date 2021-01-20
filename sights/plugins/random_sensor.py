from sights.api import v1 as api
import random
from dataclasses import dataclass

@dataclass
class RandomSensorConfig:
    minimum: int
    maximum: int

class RandomSensor:
    def __init__(self, config):
        self.minimum = int(config.minimum)
        self.maximum = int(config.maximum)

    def get(self):
        return random.randint(self.minimum, self.maximum)

sensor = api.Sensor(
    name="RandomSensor", 
    description="RandomSensor", 
    sensor_class=RandomSensor, 
    config_class=RandomSensorConfig
)

api.plugins.register_sensor_plugin(sensor)
