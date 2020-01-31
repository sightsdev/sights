from sensor_wrapper import SensorWrapper
import psutil

class DiskUsageWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'disk_usage'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)

    def get_initial(self):
        # >> 20 will convert bytes to megabytes. Then we divide by 1024 to get GB but with decimals
        # Then round to 2 decimal places. This is the limit when displayed on the circle graph
        return {"limit": round((psutil.disk_usage('/').total >> 20) / 1024, 2)}

    def get_data(self):
        # Get disk space in use
        return round((psutil.disk_usage('/').used >> 20) / 1024, 2)