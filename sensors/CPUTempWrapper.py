from sensor_wrapper import SensorWrapper
import psutil

class CPUTempWrapper(SensorWrapper):
    _key = 'cpu_temp'
    
    def __init__(self):
        SensorWrapper.__init__(self)

    def get_data(self):
        msg = {}
        # Get highest CPU temp from system
        temp_data = psutil.sensors_temperatures()
        # Check if 'coretemp' is reported by psutil
        if 'coretemp' in temp_data:
            # Find highest CPU core temp
            msg['cpu_temp'] = max(temp_data['coretemp'])
        # Some systems (e.g. Nvidia Jetson) will report temp differently
        elif 'thermal-fan-est' in temp_data:
            msg['cpu_temp'] = temp_data['thermal-fan-est'][0].current
        return msg

    def get_info(self):
        return psutil.sensors_temperatures()