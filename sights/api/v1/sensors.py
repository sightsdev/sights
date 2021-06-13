from ...components.sensor import sensors, sensors_plugins


def create(sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensors_plugins[sensor["type"]]
    # Retrieve an instance of the sensor class with dependencies injected
    sensors[int(sensor["id"])] = plugin.sensor_class(**sensor["config"])


def get_data(id):
    if (id in sensors):
        return sensors[id].get()
    else:
        return None


def get_info(id):
    return sensors[id].info
