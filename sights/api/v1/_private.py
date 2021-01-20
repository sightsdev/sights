import argparse
import sys
from configparser import ConfigParser
from typing import Any, Type

from ...components.sensor import Sensor, Sensors
from ...components.camera import Camera


def register_sensor_plugin(sensor: Sensor):
    sensor_plugins[sensor.name] = sensor


def create_sensor(sensor):
    # find the corresponding sensor class defined in a plugin
    plugin = sensor_plugins[sensor["type"]]
    # create the appropriate configuration class with the args defined in the config file
    config = plugin.config_class(**sensor["config"])
    # Retrieve an instance of the sensor class with dependencies injected
    sensors[int(sensor["id"])] = plugin.sensor_class(config)
    # populate sensor info
    sensors[int(sensor["id"])].info = config


def get_sensor_data(id):
    return sensors[id].get()


def get_sensor_info(id):
    return sensors[id].info


def create_camera(id):
    """Video streaming generator function."""
    camera = get_camera(id)

    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def get_camera(id):
    camera = None
    try:
        camera = cameras[id]
    except KeyError:
        camera = Camera()
        camera.start(video_source=id)
        cameras[id] = camera
    return camera


def set_camera_resolution(id, width, height):
    get_camera(id).set_resolution(width, height)


def get_camera_resolution(id):
    return get_camera(id).get_resolution()


def set_camera_framerate(id, framerate):
    get_camera(id).set_framerate(framerate)


def get_camera_framerate(id):
    return get_camera(id).get_framerate()


cameras = {}
sensor_plugins = {}
sensors = {}
