from sights.components.sensor import SensorConfig, SensorPlugin
from sights.components.motor import ConnectionConfig, MotorConfig, MotorPlugin
from sights.components.state import State
from sights.restapi import api as restapi
from sights.restapi import custom_api

def list_all() -> list[SensorPlugin | MotorPlugin]:
    return [plugin for plugin in State.sensor_plugins | State.motor_plugins]

def list_sensor_plugins() -> list[SensorPlugin]:
    return [plugin for plugin in State.sensor_plugins]

def list_motor_plugins() -> list[MotorPlugin]:
    return [plugin for plugin in State.motor_plugins]

def register_sensor_plugin(plugin: SensorPlugin):
    State.sensor_plugins[plugin.name] = plugin

def register_motor_plugin(plugin: MotorPlugin):
    State.motor_plugins[plugin.name] = plugin

def register_new_endpoint(resource, id, url):
    custom_api.add_resource(resource, f"{id}/{url}")

def get_plugin_from_config(config: MotorConfig | SensorConfig | ConnectionConfig) -> SensorPlugin | MotorPlugin:
    if isinstance(config, (MotorConfig, ConnectionConfig)):
        for plugin in State.motor_plugins.values():
            if config.__class__ == plugin.motor_config or config.__class__ == plugin.connection_config:
                return plugin
    elif isinstance(config, SensorConfig):
        for plugin in State.sensor_plugins.values():
            print(f"{config} and {plugin.sensor_config}")
            if config.__class__ == plugin.sensor_config:
                return plugin
    return None