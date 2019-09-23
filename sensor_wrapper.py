import time

class SensorWrapper:
    def __init__(self, bus=None):
        # i2c bus, if required
        self.bus = bus
        # Last time data get_data was called
        self.last_run = time.time()
        # Disabled by default
        self.enabled = False

    def load_config(self, config):
        # Whether or not sensor is enabled
        self.enabled = config[self._key]['enabled']
        # How often to get data from this sensor
        self.frequency = config[self._key]['frequency']

    def get_data(self):
        return None

    def get_info(self):
        return None        

    def ready(self):
        elapsed_time = time.time() - self.last_run
        if (elapsed_time > self.frequency):
            self.last_run = time.time()
            return True
        else:
            return False