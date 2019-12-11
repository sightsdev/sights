from sensor_wrapper import SensorWrapper
from mlx90614 import MLX90614

class MLX90614Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    _type = 'mlx90614'

    def __init__(self, config):
        SensorWrapper.__init__(self, config, bus)

        # Create sensor object
        self.sensor = MLX90614(self.bus)
        # Additional config option for i2c address
        self.address = config['address']

    def get_data(self):
        msg = {}
        # Get data and round to 1 dp
        msg["temp"][0] = round(self.sensor.get_object_1(), 1)
        return msg