from sensor_wrapper import SensorWrapper
import Adafruit_AMG88xx.Adafruit_AMG88xx as AMG88xx


class AMG8833Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'amg8833'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)
        # Additional config option for i2c address, default to 0x69
        self.address = int(config.get('address', "0x69"), 16)
        # Create sensor object
        self.sensor = AMG88xx(address=self.address)

    def get_data(self):
        return self.sensor.readPixels()
