from sensor_wrapper import SensorWrapper
import psutil

class CPUTempWrapper(SensorWrapper):
    def __init__(self, frequency):
        SensorWrapper.__init__(self, frequency)

    def get_data(self):
        msg = {}
        # Get highest CPU temp from system
        temp_data = psutil.sensors_temperatures()
        # Check if we can get temp sensors (since it might be empty on Windows systems)
        if temp_data:
            highest_temp = 0.0
            # Compare CPU core temps and find highest value
            for i in temp_data['coretemp']:
                if (i.current > highest_temp):
                    highest_temp = i.current
            # Some systems (e.g. Nvidia Jetson) will report it in this 
            if (temp_data['thermal-fan-est']):
                current = temp_data['thermal-fan-est'][0].current
                if (current > highest_temp):
                    highest_temp = current
            # Add to message
            msg["cpu_temp"] = highest_temp
        return msg

    def get_info(self):
        return psutil.sensors_temperatures()