from sights.components.sensor import Sensor, SensorPlugin, sensor_plugins
from sights.components.motor import Motor, MotorPlugin, motor_plugins


def list_all():
    return [plugin for plugin in sensor_plugins | motor_plugins]

def list_sensor_plugins():
    return [plugin for plugin in sensor_plugins]

def list_motor_plugins():
    return [plugin for plugin in motor_plugins]

def register_sensor_plugin(plugin: SensorPlugin):
    sensor_plugins[plugin.name] = plugin

def register_motor_plugin(plugin: MotorPlugin):
    motor_plugins[plugin.name] = plugin
