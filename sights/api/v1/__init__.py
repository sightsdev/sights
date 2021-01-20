# This file contains the classes, functions and constants
# that can be used by plugins.

from ...components.sensor import Sensor
from .sensors import create_sensor, get_sensor_data, get_sensor_info
from .cameras import create_camera, set_camera_framerate, get_camera_framerate, set_camera_resolution, get_camera_resolution
from .plugins import register_sensor_plugin
