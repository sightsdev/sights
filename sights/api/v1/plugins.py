from ._private import sensor_plugins
from ...components.sensor import Sensor


def register_sensor_plugin(sensor: Sensor):
    sensor_plugins[sensor.name] = sensor
