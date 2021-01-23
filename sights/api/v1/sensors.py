from ._private import sensor_plugins, sensors


def create(sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensor_plugins[sensor["type"]]
    # create the appropriate configuration class with the args defined in the config file
    config = plugin.config_class(**sensor["config"])
    # Retrieve an instance of the sensor class with dependencies injected
    sensors[int(sensor["id"])] = plugin.sensor_class(config)
    # populate sensor info
    sensors[int(sensor["id"])].info = config


def get_data(id):
    return sensors[id].get()


def get_info(id):
    return sensors[id].info
