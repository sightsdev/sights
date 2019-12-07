from sensor_wrapper import SensorWrapper
import Adafruit_AMG88xx.Adafruit_AMG88xx as AMG88xx

# Using deprecated library:
# https://github.com/adafruit/Adafruit_AMG88xx_python

class AMG8833Wrapper(SensorWrapper):
    _key = 'thermal_camera'

    def __init__(self):
        SensorWrapper.__init__(self)
        self.sensor = AMG88xx()

    def get_data(self):
        return {"thermal_camera": self.sensor.readPixels()}