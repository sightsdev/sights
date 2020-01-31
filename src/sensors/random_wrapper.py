from sensor_wrapper import SensorWrapper
import random

class RandomWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'random'
    
    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        self.min = int(config.get('min', 25))
        self.max = int(config.get('max', 30))
        self.limit = int(config.get('limit', 50))

    def get_initial(self):
        # On circle graphs, set the maximum value (limit)
        return {"limit": self.limit}

    def get_data(self):
        return random.randint(self.min, self.max)