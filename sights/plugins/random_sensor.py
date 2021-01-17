from sights.api import v1
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

    def getdata(self):
        return random.randint(self.minimum, self.maximum)

sensor = v1.Sensor(name="RandomSensor", description="RandomSensor", sensor_class=RandomSensor, config_class=RandomSensorConfig)

v1.register_sensor_plugin(sensor)