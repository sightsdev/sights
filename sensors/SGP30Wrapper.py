from sensor_wrapper import SensorWrapper
from sgp30 import SGP30

class SGP30Wrapper(SensorWrapper):
    def __init__(self, bus, address, frequency):
        Sensor.__init__(bus, address, frequency)
        self.sensor = SGP30(self.bus)
        self.sensor.init_sgp()

    def get_data(self):
        data = self.sensor.read_measurements()
        msg = {}
        msg["co2"] = data[0][0]
        msg["tvoc"] = data[0][1]
        return msg

    def get_info(self):
        return self.sensor.read_features() + self.sensor.read_serial()