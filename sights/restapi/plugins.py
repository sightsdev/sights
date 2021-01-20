from flask import jsonify
from flask_restx import Namespace, Resource
from sights.components.sensor import Sensors
from sights.api import v1 as api

restapi = Namespace('plugins', description='Plugin related operations')


@restapi.route('/sensors')
class Sensors(Resource):
    def get(self):
        sensor_plugins: Sensors = api._private.sensor_plugins
        return jsonify([plugin for plugin in sensor_plugins])
