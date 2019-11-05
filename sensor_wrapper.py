import time
import logging

class SensorWrapper:
    def __init__(self, bus=None):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # i2c bus, if required
        self.bus = bus
        # Last time data get_data was called
        self.last_run = time.time()
        # Disabled by default
        self.enabled = False

    def load_config(self, config):
        try:
            # Whether or not sensor is enabled
            self.enabled = config[self._key]['enabled']
            if self.enabled:
                try:
                    # How often to get data from this sensor
                    self.frequency = config[self._key]['frequency']
                except KeyError:
                    # Failed to get frequency; warn the user and set a reasonable default value
                    self.logger.warning(f"Frequency for {self._key} sensor not set! Check your config.")
                    self.frequency = 1
                    self.logger.info(f"Set frequency for {self._key} sensor to default: {self.frequency}.")
            else:
                # Sensor is disabled. Frequency is still required.
                self.frequency = -1
        except KeyError:
            # Encountered an error getting values from config
            self.logger.warning(f"Config block for {self._key} does not exist or is malformed! Check your config.")
            self.enabled = False
            self.frequency = -1

    def get_data(self):
        return None

    def get_info(self):
        return None        

    def is_ready(self):
        # Time since last checked
        elapsed_time = time.time() - self.last_run
        if (elapsed_time > self.frequency):
            # Store current time as last_time 
            self.last_run = time.time()
            # Only return True if sensor is actually enabled
            return self.enabled
        else:
            return False