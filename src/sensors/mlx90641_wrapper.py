from sensor_wrapper import SensorWrapper
import seeed_mlx9064x


class MLX90641Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'mlx90641'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        # Additional config option for i2c address, default to 0x33
        self.address = int(config.get('address', "0x33"), 16)
        # Create sensor object
        self.sensor = seeed_mlx9064x.grove_mxl90641(address=self.address)
        self.sensor.refresh_rate = seeed_mlx9064x.RefreshRate.REFRESH_4_HZ

    def get_data(self):
        data = [0] * 192
        self.sensor.getFrame(data)
        # Correct mirrored MLX90641 output.
        mirror = []
        matrix = [data[i:i + 16] for i in range(0, len(data), 16)]
        for row in matrix:
            row.reverse()
            mirror.extend(row)
        return mirror
