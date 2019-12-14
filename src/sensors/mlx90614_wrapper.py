from sensor_wrapper import SensorWrapper
from mlx90614 import MLX90614
import smbus2

class MLX90614Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'mlx90614'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        # Additional config option for i2c address
        self.address = config['address']
        self.bus = smbus2.SMBus(1)
        # Create sensor object
        self.sensor = MLX90614(self.bus, address=0x5B)
        

    def get_data(self):
        # Get data and round to 1 dp
        return round(self.sensor.get_object_1(), 1)
