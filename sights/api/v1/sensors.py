from ...components.sensor import sensors, sensor_plugins


def create(sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensor_plugins[sensor["type"]]
    # Retrieve an instance of the sensor class with dependencies injected
    sensors[int(sensor["id"])] = plugin.sensor_class(**sensor["config"])

def create_from_list(sensors: list):
    for sensor in sensors:
        create(sensor)

def get_data(id):
    if id in sensors:
        return sensors[id].get()
    else:
        return None


def get_info(id):
    return sensors[id].info
