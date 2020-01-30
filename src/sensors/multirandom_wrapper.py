from sensor_wrapper import SensorWrapper
import random

class MultiRandomWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'multirandom'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        self.min = int(config.get('min', 25))
        self.max = int(config.get('max', 30))

    def get_data(self):
        msg = {}
        msg["a"] = random.randint(self.min, self.max)

        msg["b"] = random.randint(self.min, self.max)

        msg["c"] = random.randint(self.min, self.max)

        return msg