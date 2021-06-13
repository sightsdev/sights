from sights.components.sensor import sensor_plugins
from sights.components.state import State


def list_all():
    return [sensor for sensor in State.sensors]

def create(sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensor_plugins[sensor["type"]]
    # Retrieve an instance of the sensor class with dependencies injected
    State.sensors[sensor["id"]] = plugin.sensor_class(**sensor["config"])
    State.sensors[sensor["id"]].init()

def get_data(id):
    if id in State.sensors:
        return State.sensors[id].get()
    else:
        return None, 404

def get_info(id):
    return State.sensors[id].info