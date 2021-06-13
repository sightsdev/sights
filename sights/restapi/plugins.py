from flask import jsonify
from flask_restx import Namespace, Resource
from sights.api import v1 as api

restapi = Namespace('plugins', description='Plugin related operations')


@restapi.route('/plugins')
class HandlePlugins(Resource):
    def get(self):
        return api.plugins.list_all()


@restapi.route('/plugins/sensors')
class HandleSensorPlugins(Resource):
    def get(self):
        return api.plugins.list_sensor_plugins()


@restapi.route('/plugins/motors')
class HandleMotorPlugins(Resource):
    def get(self):
        return api.plugins.list_motor_plugins()
