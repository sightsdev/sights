from ._private import sensor_plugins
from ...components.sensor import Sensor


def register_sensor_plugin(sensor: Sensor):
    sensor_plugins[sensor.name] = sensor


def list_all():
    return [plugin for plugin in sensor_plugins]
