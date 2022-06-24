from sights.api.v1.plugins import get_plugin_from_config
from sights.components.motor import Motor, MotorConfig, MotorPlugin
from sights.components.state import State
import logging

def list_all():
    return [i for i in State.motors.items()]

def create(config : MotorConfig) -> Motor:
    if (config.id in State.motors):
        logging.error(f"Motor with id {config.id} already exists! Will not create a duplicate")
        return
    # Find the corresponding plugin class for this motor
    plugin : MotorPlugin = get_plugin_from_config(config)
    # Create an instance of the motor class
    State.motors[config.id] = plugin.motor_class(config)
    return State.motors[config.id]

def set_motor_speed(id, speed):
    State.motors[id].set_speed(speed)

def set_motor_position(id, pos):
    State.motors[id].set_pos(pos)

def get_info(id):
    return State.motors[id].info
