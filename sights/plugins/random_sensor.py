from dataclasses import dataclass
from sights.api import v1 as api
from sights.components.sensor import *
import random

@dataclass
class RandomSensor(Sensor):
    minimum: int = 10
    maximum: int = 20

    def configure(self):
        print("Min and max are:", self.minimum, "and", self.maximum)

    def get(self):
        return random.randint(self.minimum, self.maximum)

plugin = api.SensorPlugin(
    name="RandomSensor", 
    description="A random sensor", 
    sensor_class=RandomSensor
)

api.plugins.register_sensor_plugin(plugin)
