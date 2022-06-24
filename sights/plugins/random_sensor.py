from dataclasses import dataclass
from sights.api import v1 as api
from sights.components.sensor import *
import random

@dataclass
class RandomSensorConfig(SensorConfig):
    minimum: int = 10
    maximum: int = 20

class RandomSensor(Sensor):
    def configure(self):
        print(f"RandomSensor: Min and max are {self.config.minimum} and {self.config.maximum}")

    def get(self):
        return random.randint(self.config.minimum, self.config.maximum)

plugin = SensorPlugin(
    name="RandomSensor", 
    description="A random number generator masquerading as a sensor", 
    sensor_class=RandomSensor,
    sensor_config=RandomSensorConfig
)

api.plugins.register_sensor_plugin(plugin)
