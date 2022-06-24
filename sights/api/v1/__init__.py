# This file contains the classes, functions and constants
# that can be used by plugins.

from sights.components.settings import Settings
from sights.components.state import State
from . import cameras, motors, sensors, connections, plugins

def load_settings_to_state(settings: Settings):
    for config in settings.cameras:
        cameras.create(config)
    for config in settings.sensors:
        sensors.create(config)
    for config in settings.connections:
        connections.create(config)
    for config in settings.motors:
        motors.create(config)

def get_settings_from_state() -> Settings:
    settings = Settings()
    settings.cameras     = [i.config for i in State.cameras.items()]
    settings.sensors     = [i.config for i in State.sensors.items()]
    settings.motors      = [i.config for i in State.motors.items()]
    settings.connections = [i.config for i in State.connections.items()]
    return Settings