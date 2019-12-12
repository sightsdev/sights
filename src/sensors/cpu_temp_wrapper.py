from sensor_wrapper import SensorWrapper
import psutil

class CPUTempWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'cpu_temp'
    
    def __init__(self, config):
        SensorWrapper.__init__(self, config)

    def get_data(self):
        temperature = None
        # Get highest CPU temp from system
        temp_data = psutil.sensors_temperatures()
        # Check if 'coretemp' is reported by psutil
        if 'coretemp' in temp_data:
            # Find highest CPU core temp
            highest = 0
            for core in temp_data['coretemp']:
                if core.current > highest:
                    highest = core.current
            temperature = highest
        # Some systems will report temp differently
        # Nvidia Jetson
        elif 'thermal-fan-est' in temp_data:
            temperature = temp_data['thermal-fan-est'][0].current
        # Raspberry Pi
        elif 'cpu-thermal' in temp_data:
            temperature = temp_data['cpu-thermal'][0].current
        return temperature