import importlib
import pkgutil
import sys
import sights.plugins
import flask
import os
from flask import render_template, Response,  request, jsonify
from sights.api import v1 as api
from sights.components.sensor import Sensors

# import camera driver
from camera.camera import Camera

def iter_namespace(ns_pkg):
    return pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + ".")

def load_plugins():
    for _, name, _ in iter_namespace(sights.plugins):
        importlib.import_module(name)

def load_sensors(sensors):
    for sensor in sensors:
        api.create_sensor(sensor)

app = flask.Flask(__name__)
app.config["DEBUG"] = True

sensors_config = [
    {
        "id": "1",
        "type": "RandomSensor",
        "config": {
            "minimum": 40,
            "maximum": 99
        }
    },
    {
        "id": "2",
        "type": "RandomSensor",
        "config": {
            "minimum": 1,
            "maximum": 2
        }
    }
]

load_plugins()
load_sensors(sensors_config)

camera = Camera()

def create_camera():
    """Video streaming generator function."""
    camera.start()
    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/stream')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    return Response(create_camera(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/', methods=['GET'])
def home():
    return "<h1>sights api</h1><p>This site is a prototype API</p>"

@app.route('/api/v1/plugins/sensors/', methods=['GET'])
def plugins_sensors_all():
    sensor_plugins: Sensors = api._private.sensor_plugins
    return flask.jsonify([plugin for plugin in sensor_plugins])

@app.route('/api/v1/sensors', methods=['GET'])
def sensors_all():
    sensors: Sensors = api._private.sensors
    return jsonify([sensor for sensor in sensors])

@app.route('/api/v1/sensors/<sensor_id>', methods=['GET'])
def sensors_id(sensor_id):
    return jsonify(api.get_sensor_info(sensor_id))

@app.route('/api/v1/sensors/<sensor_id>/data', methods=['GET'])
def sensors_data(sensor_id):
    return jsonify(api.get_sensor_data(sensor_id))

@app.route('/api/v1/sensors', methods=['PUT'])
def create_sensor():
    api.create_sensor(request.get_json())
    return '', 204

@app.route('/api/v1/cameras/1/resolution', methods=['POST'])
def set_camera_resolution():
    width = request.get_json()["width"]
    height = request.get_json()["height"]
    camera.set_size(width, height)
    camera.start()
    return '', 200

app.run(host="0.0.0.0")