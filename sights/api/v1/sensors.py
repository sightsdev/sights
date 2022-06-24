from typing import Any
from sights.api.v1.plugins import get_plugin_from_config
from sights.components.sensor import Sensor, SensorConfig, SensorPlugin
from sights.components.state import State
import logging

def list_all() -> list[Sensor]:
    return [sensor for sensor in State.sensors.items()]

def create(config : SensorConfig) -> Sensor:
    # Find the corresponding plugin class for this sensor
    plugin : SensorPlugin = get_plugin_from_config(config)
    # Create an instance of the sensor class
    State.sensors[config.id] = plugin.sensor_class(config)
    return State.sensors[config.id]

def get_data(id: int) -> Any:
    if id in State.sensors:
        return State.sensors[id].get()
    else:
        logging.error(f"Can't retrieve data. Couldn't find sensor with id: {id}")
        return None, 404

def get_info(id: int):
    return State.sensors[id].info