from sights.components.sensor import Sensor, sensor_plugins
from sights.components.state import State
import logging

def list_all():
    return [sensor for sensor in State.sensors]

def create(sensor : Sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensor_plugins[sensor.type]
    # Retrieve an instance of the sensor class with dependencies injected
    State.sensors[sensor.id] = plugin.sensor_class(**sensor["config"])

def get_data(id : int):
    if id in State.sensors:
        return State.sensors[id].get()
    else:
        logging.error(f"Can't retrieve data. Couldn't find sensor with id: {id}")
        return None, 404

def get_info(id : int):
    return State.sensors[id].info