from sensor_wrapper import SensorWrapper
import random


class RandomWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'random'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        self.min = int(config.get('min', 25))
        self.max = int(config.get('max', 30))

    def get_data(self):
        return random.randint(self.min, self.max)
