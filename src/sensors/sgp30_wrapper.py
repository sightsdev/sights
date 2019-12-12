from sensor_wrapper import SensorWrapper
from sgp30 import SGP30

class SGP30Wrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'sgp30'

    def __init__(self, config, bus):
        SensorWrapper.__init__(self, config, bus)
        # Create sensor object
        self.sensor = SGP30(self.bus)
        self.sensor.init_sgp()

    def get_data(self):
        data = self.sensor.read_measurements()
        msg = {
            "co2": data[0][0],
            "tvoc": data[0][1]
        }
        return msg