from dataclasses import dataclass
from sights.api import v1 as api
from sights.components.sensor import *

@dataclass()
class MLX90614(Sensor):
    address: int = 0x5A

    def __post_init__(self):
        # Only import when trying to use this library
        import mlx90614
        from smbus2 import SMBus
        i2cbus = SMBus(1)
        # Create sensor object
        self.sensor = mlx90614.MLX90614(i2cbus, address=self.address)

    def get(self):
        # Get data and round to 1 dp
        return round(self.sensor.get_object_1(), 2)

plugin = api.SensorPlugin(
    name="MLX90614", 
    description="MLX90614", 
    sensor_class=MLX90614
)

api.plugins.register_sensor_plugin(plugin)