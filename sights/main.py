from sights.api import v1 as api
from sights.restapi import api as restapi
import sights.plugins
import importlib
import pkgutil
import flask
import json

def iter_namespace(ns_pkg):
    return pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + ".")

# Load any plugins on the system
for _, name, _ in iter_namespace(sights.plugins):
    importlib.import_module(name)

settings = Settings()

# Load the settings file
settings = json.load(open("settings.json"))
api.sensors.create_from_list(settings["sensors"])
api.cameras.create_from_list(settings["cameras"])

# Flask and REST setup
app = flask.Flask(__name__)
app.config["DEBUG"] = True
restapi.init_app(app)

app.run(host="0.0.0.0")
