from flask import Blueprint, request, jsonify
from flask_restx import Namespace, Resource
from sights.components.sensor import Sensors
from sights.api import v1 as api

restapi = Namespace('sensors', description='Sensor related operations')


@restapi.route('/')
class Sensors(Resource):
    def get(self):
        return [sensor for sensor in api._private.sensors]

    def put(self):
        api.sensors.create(request.get_json())
        return '', 204


@restapi.route('/<int:sensor_id>')
class Sensor(Resource):
    def get(self, sensor_id: int):
        return api.sensors.get_info(sensor_id)


@restapi.route('/<int:sensor_id>/data')
class Data(Resource):
    def get(self, sensor_id: int):
        result = api.sensors.get_data(sensor_id)
        if (result is not None):
            return result
        else:
            return {'error', 'Sensor does not exist'}, 404
