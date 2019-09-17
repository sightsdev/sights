import time

class SensorWrapper:
    def __init__(self, bus, address, frequency):
        self.bus = bus
        self.address = address
        self.frequency = frequency
        
        self.last_run = time.time()

    def get_data(self):
        pass

    def get_info(self):
        pass        

    def ready(self):
        elapsed_time = time.time() - self.last_run
        if (elapsed_time > self.frequency):
            self.last_run = time.time()
            return True
        else:
            return False