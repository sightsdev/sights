from ...components.motor import motor_plugins, motors


def create(motor):
    # find the corresponding sensor class defined in a plugin
    plugin = motor_plugins[motor["type"]]
    # Retrieve an instance of the sensor class with dependencies injected
    motors[int(motor["id"])] = plugin.connection_class(**motor["config"])


def get_info(id):
    return motors[id].info
