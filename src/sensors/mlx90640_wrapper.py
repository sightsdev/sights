from sensor_wrapper import SensorWrapper
import seeed_mlx9064x


class MLX90640Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'mlx90640'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        # Additional config option for i2c address, default to 0x33
        self.address = int(config.get('address', "0x33"), 16)
        # Create sensor object
        self.sensor = seeed_mlx9064x.grove_mxl90640(address=self.address)
        self.sensor.refresh_rate = seeed_mlx9064x.RefreshRate.REFRESH_4_HZ

    def get_data(self):
        data = [0] * 768
        self.sensor.getFrame(data)
        # Correct mirrored MLX90640 output.
        mirror = []
        matrix = [data[i:i + 32] for i in range(0, len(data), 32)]
        for row in matrix:
            row.reverse()
            mirror.extend(row)
        return [round(i) for i in mirror]
