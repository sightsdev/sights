from sensor_wrapper import SensorWrapper
from mlx90614 import MLX90614

class MLX90614Wrapper(SensorWrapper):
    def __init__(self, frequency, bus, address=0x5A):
        SensorWrapper.__init__(frequency, bus, address)
        self.sensor = MLX90614(self.bus, self.address)

    def get_data(self):
        msg = {}
        msg["temp"][0] = round(self.sensor.get_object_1(), 1)
        return msg

    def get_info(self):
        return None