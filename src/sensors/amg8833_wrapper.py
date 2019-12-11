from sensor_wrapper import SensorWrapper
import Adafruit_AMG88xx.Adafruit_AMG88xx as AMG88xx

class AMG8833Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    _type = 'amg8833'

    def __init__(self, config):
        SensorWrapper.__init__(self, config)

        # Create sensor object
        self.sensor = AMG88xx()

    def get_data(self):
        return {"thermal_camera": self.sensor.readPixels()}