from sights.api.v1.plugins import get_plugin_from_config
from sights.components.motor import Connection, ConnectionConfig, MotorPlugin
from sights.components.state import State
import logging

def list_all() -> list[Connection]:
    return [i for i in State.connections.items()]

def create(config : ConnectionConfig) -> Connection:
    if (config.id in State.connections):
        logging.error(f"Connection with id {config.id} already exists! Will not create a duplicate")
        return
    # Find the corresponding plugin class for this motor
    plugin : MotorPlugin = get_plugin_from_config(config)
    # Create an instance of the motor class
    State.connections[config.id] = plugin.connection_class(config)
    return State.connections[config.id]

def get_info(id):
    return State.connections[id].info
