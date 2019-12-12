from sensor_wrapper import SensorWrapper
import psutil

class MemoryWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'memory'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)

    def get_data(self):
        # Get memory in use and add to msg, using bit shift operator to represent in MB
        return psutil.virtual_memory().used >> 20

    def get_info(self):
        return psutil.virtual_memory()