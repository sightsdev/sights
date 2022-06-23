from sights.components.motor import Motor, motor_plugins, motors
from sights.components.state import State
import logging

def create(motor : Motor):
    if (motor.id in State.motors):
        logging.error(f"Motor with id {motor.id} already exists! Will not create a duplicate")
        return
    # find the corresponding class defined in a plugin
    plugin = motor_plugins[motor["type"]]
    # Create an instance of the Motor subclass with configuration injected
    State.motors[motor.id] = plugin.connection_class(**motor["config"])

def get_info(id):
    return State.motors[id].info
