from sights.api import v1 as api
from sights.components.sensor import *
from dataclasses import dataclass

@dataclass
class MLX90614Config:
    i2c_address: int

class MLX90614(Sensor):
    

    def __init__(self, config):
        # Only import when trying to use this library
        import mlx90614
        from smbus2 import SMBus
        i2cbus = SMBus(1)
        # Additional config option for i2c address, default to 0x5A
        self.address = int(config.get('address', "0x5A"), 16)
        # Create sensor object
        self.sensor = mlx90614.MLX90614(i2cbus, address=self.address)

    def get(self):
        # Get data and round to 1 dp
        return round(self.sensor.get_object_1(), 2)

plugin = api.SensorPlugin(
    name="MLX90614", 
    description="MLX90614", 
    sensor_class=MLX90614, 
    config_class=MLX90614Config
)

api.plugins.register_sensor_plugin(plugin)