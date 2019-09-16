from sensor_wrapper import SensorWrapper
import psutil

class SystemWrapper(SensorWrapper):
    def __init__(self, bus, address, frequency):
        Sensor.__init__(bus, address, frequency)

    def get_data(self):
        msg = {}
        # Get highest CPU temp from system
        temp_data = psutil.sensors_temperatures()
        if len(temp_data) != 0:
            highest_temp = 0.0
            for i in temp_data['coretemp']:
                if (i.current > highest_temp):
                    highest_temp = i.current
            # Add to message
            msg["cpu_temp"] = str(highest_temp)
        #msg["cpu_temp"] = str(psutil.sensors_temperatures()['thermal-fan-est'][0].current)

        # Get RAM in use and total RAM
        memory = psutil.virtual_memory()
        # Add to message, use bit shift operator to represent in MB
        msg["memory_used"] = memory.used >> 20

        return msg

    def get_info(self):
        return self.sensor.read_features() + self.sensor.read_serial()