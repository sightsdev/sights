from sensor_wrapper import SensorWrapper
from mlx90614 import MLX90614

class MLX90614Wrapper(SensorWrapper):
    _key = 'temperature'

    def __init__(self):
        SensorWrapper.__init__(self, bus)
        self.sensor = MLX90614(self.bus)

    # Load config using inherited method, then also load additional value 'address'
    def load_config(self, config):
        SensorWrapper.load_config(config)
        # i2c address
        self.address = config[self._key]['address']

    def get_data(self):
        msg = {}
        # Get data and round to 1 dp
        msg["temp"][0] = round(self.sensor.get_object_1(), 1)
        return msg