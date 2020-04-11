from sensor_wrapper import SensorWrapper
import random


class MultiRandomWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'multirandom'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        self.min_a = int(config.get('min_a', 25))
        self.max_a = int(config.get('max_a', 30))
        self.min_b = int(config.get('min_b', 25))
        self.max_b = int(config.get('max_b', 30))
        self.min_c = int(config.get('min_c', 25))
        self.max_c = int(config.get('max_c', 30))

    def get_data(self):
        msg = {
            "a": random.randint(self.min_a, self.max_a),
            "b": random.randint(self.min_b, self.max_b),
            "c": random.randint(self.min_c, self.max_c)
        }

        return msg
