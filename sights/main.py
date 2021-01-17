import importlib
import pkgutil
import sys
import sights.plugins
import flask
from flask import request, jsonify
from sights.api import v1 as api
from sights.components.sensor import Sensors

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

@app.route('/', methods=['GET'])
def home():
    return "<h1>sights api</h1><p>This site is a prototype API</p>"

@app.route('/api/v1/plugins/sensors/', methods=['GET'])
def sensors_all():
    sensors: Sensors = api._private.sensor_plugins
    new = []
    for sensor in sensors:
        new.append(sensor)
    return flask.jsonify(new)

@app.route('/api/v1/sensors', methods=['GET'])
def sensors_id():
    if 'id' in request.args:
        id = request.args['id']
    else:
        return "Error: No id field provided. Please specify an id."
    return jsonify(api.get_sensor_data(id))

app.run()
