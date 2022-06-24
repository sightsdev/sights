from sights.components.sensor import SensorConfig, SensorPlugin, sensor_plugins
from sights.components.motor import ConnectionConfig, MotorConfig, MotorPlugin, motor_plugins
from sights.components.state import State


def list_all():
    return [plugin for plugin in State.sensor_plugins | State.motor_plugins]

def list_sensor_plugins():
    return [plugin for plugin in State.sensor_plugins]

def list_motor_plugins():
    return [plugin for plugin in State.motor_plugins]

def register_sensor_plugin(plugin: SensorPlugin):
    State.sensor_plugins[plugin.name] = plugin

def register_motor_plugin(plugin: MotorPlugin):
    State.motor_plugins[plugin.name] = plugin

def get_plugin_from_config(config_class: MotorConfig | SensorConfig | ConnectionConfig) -> SensorPlugin | MotorPlugin:
    if isinstance(config_class, (MotorConfig, ConnectionConfig)):
        for plugin in State.motor_plugins:
            if config_class == plugin.motor_config or config_class == plugin.connection_config:
                return plugin
    elif isinstance(config_class, SensorConfig):
        for plugin in State.sensor_plugins:
            if config_class == plugin.sensor_config:
                return plugin
    return None