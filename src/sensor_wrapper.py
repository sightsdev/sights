import time
import logging

class SensorWrapper:
    def __init__(self, config, bus=None):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # i2c bus, if required
        self.bus = bus
        # Last time data get_data was called
        self.last_run = time.time()

        # Attempt to load the sensor's configuration
        
        # If any of these required values do not exist, display a warning
        if {'enabled', 'type', 'frequency', 'name'} > set(config):
            self.logger.warning(f"Sensor config entry: {config} is malformed! Check your config.")

        # This will always work since we already accessed config["type"] to create this instance
        self.type = config.get('type')
        # Load essential configuration options
        self.enabled = config.get('enabled', False)
        self.frequency = config.get('frequency', -1)
        self.name = config.get('name', self.type)

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