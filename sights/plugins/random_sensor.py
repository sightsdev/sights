from sights.api import v1 as api
import random
from dataclasses import dataclass

@dataclass
class RandomSensorConfig:
    minimum: int
    maximum: int

class RandomSensor:
    def __init__(self, config):
        self.minimum = config.minimum
        self.maximum = config.maximum

    def get(self):
        return random.randint(self.minimum, self.maximum)

sensor = api.Sensor(
    name="RandomSensor", 
    description="RandomSensor", 
    sensor_class=RandomSensor, 
    config_class=RandomSensorConfig
)

api.register_sensor_plugin(sensor)