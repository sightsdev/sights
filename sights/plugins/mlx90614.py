from sights.api import v1
import mlx90614
from dataclasses import dataclass

@dataclass
class MLX90614Config:
    i2c_address: int

class MLX90614:
    def __init__(self, i2cbus: v1.SMBus):
        self._i2cbus = i2cbus
        # Additional config option for i2c address, default to 0x5A
        #self.address = int(config.get('address', "0x5A"), 16)
        # Create sensor object
        self.sensor = mlx90614.MLX90614(self._i2cbus)#, address=self.address)

    def __call__(self):
        # Get data and round to 1 dp
        return round(self.sensor.get_object_1(), 2)


sensor = v1.Sensor(name="MLX90614", description="MLX90614", sensor_class=MLX90614, config_class=MLX90614Config)

v1.register_sensor(sensor)