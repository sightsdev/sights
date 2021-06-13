from sights.api import v1 as api
from sights.components.sensor import *
import random

class RandomSensor(Sensor):
    def __init__(self, minimum: int, maximum: int):
        self.minimum = minimum
        self.maximum = maximum

    def get(self):
        return random.randint(self.minimum, self.maximum)

plugin = api.SensorPlugin(
    name="RandomSensor", 
    description="RandomSensor", 
    sensor_class=RandomSensor
)

api.plugins.register_sensor_plugin(plugin)
