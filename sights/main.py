import importlib
import pkgutil
import sights.plugins
import flask
import json
from sights.api import v1 as api
from sights.restapi import api as restapi


def iter_namespace(ns_pkg):
    return pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + ".")


def load_plugins():
    for _, name, _ in iter_namespace(sights.plugins):
        importlib.import_module(name)


def load_sensors(sensors):
    for sensor in sensors:
        api.sensors.create(sensor)


app = flask.Flask(__name__)
app.config["DEBUG"] = True
restapi.init_app(app)

settings = json.loads(open("settings.json"))

load_plugins()
load_sensors(settings["sensors"])

app.run(host="0.0.0.0")
