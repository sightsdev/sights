from sensor_wrapper import SensorWrapper
import psutil


class DiskUsageWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'disk_usage'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        # Report in GB with 2dp by default, but allow other precisions
        self.precision = int(config.get('precision', 2))

    def get_data(self):
        # Get disk space in use
        return round((psutil.disk_usage('/').used >> 20) / 1024, self.precision)
