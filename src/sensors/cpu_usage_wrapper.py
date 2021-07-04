from sensor_wrapper import SensorWrapper
import psutil


class CPUUsageWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'cpu_usage'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)

    def get_initial(self):
        # CPU usage is always out of 100%
        return {"limit": 100}

    def get_data(self):
        return psutil.cpu_percent()
