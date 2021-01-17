import importlib
import pkgutil
import sys
import sights.plugins
import flask

def iter_namespace(ns_pkg):
    return pkgutil.iter_modules(ns_pkg.__path__, ns_pkg.__name__ + ".")

def load_plugins():
    for _, name, _ in iter_namespace(sights.plugins):
        importlib.import_module(name)

app = flask.Flask(__name__)
app.config["DEBUG"] = True

load_plugins()

@app.route('/', methods=['GET'])
def home():
    return "<h1>sights api</h1><p>This site is a prototype API</p>"

# A route to return all of the available entries in our catalog.
@app.route('/api/v1/sensors/all', methods=['GET'])
def api_all():
    return "test"

@app.route('/api/v1/commands/', methods=['GET'])
def commands_all():
    return "test"

app.run()
