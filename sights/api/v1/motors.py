from sights.components.motor import motor_plugins, motors
from sights.components.state import State


def create(motor):
    # find the corresponding sensor class defined in a plugin
    plugin = motor_plugins[motor["type"]]
    # Retrieve an instance of the sensor class with dependencies injected
    State.motors[int(motor["id"])] = plugin.connection_class(**motor["config"])

def get_info(id):
    return State.motors[id].info
