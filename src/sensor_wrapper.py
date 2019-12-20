import logging

class SensorWrapper:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # Last time get_data() was called
        self.last_run = 0
        # If any of these required values do not exist in the config, display a warning
        if {'enabled', 'type', 'frequency', 'name'} > set(config):
            self.logger.error(f"Sensor config entry: {config} is missing a required option! Check your config.")
        # Load essential configuration options
        self.enabled = config.get('enabled', False)
        self.frequency = config.get('frequency', -1)
        self.name = config.get('name', self.type_)

    def get_data(self):
        return None   

    def is_ready(self, now):
        # Time since last checked
        elapsed_time = now - self.last_run
        # Only get data if it has been long enough since last run
        if (elapsed_time > self.frequency):
            # Store current time as last_time 
            self.last_run = now
            # Only return True if sensor is actually enabled
            return self.enabled
        else:
            return False