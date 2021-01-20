import importlib
import pkgutil
import sights.plugins
import flask

from sights.api import v1 as api

from sights.endpoints.sensors import sensors_blueprint
from sights.endpoints.cameras import cameras_blueprint


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
app.register_blueprint(sensors_blueprint)
app.register_blueprint(cameras_blueprint)

config = {
    "cameras":
        {
            "front": {
                "id": 0,
                "width": 640,
                "height": 480,
                "framerate": 30
            }
        },
    "sensors":
        [
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
}

load_plugins()
load_sensors(config["sensors"])


@app.route('/', methods=['GET'])
def home():
    return "<h1>sights api</h1><p>This site is a prototype API</p>"


app.run(host="0.0.0.0")
