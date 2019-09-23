import time

class SensorWrapper:
    def __init__(self, frequency, bus=None, address=None):
        # How often to get data from this sensor
        self.frequency = frequency
        # i2c bus
        self.bus = bus
        # i2c address
        self.address = address
        # Last time data get_data was called
        self.last_run = time.time()

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