from flask import Blueprint, request, jsonify
from flask_restx import Namespace, Resource
from sights.components.sensor import Sensors
from sights.api import v1 as api

restapi = Namespace('sensors', description='Sensor related operations')


@restapi.route('/')
class Sensors(Resource):
    def get(self):
        return jsonify([sensor for sensor in api._private.sensors])

    def put(self):
        api.create_sensor(request.get_json())
        return '', 204


@restapi.route('/<int:sensor_id>')
class Sensor(Resource):
    def get(self, sensor_id: int):
        return jsonify(api.get_sensor_info(sensor_id))


@restapi.route('/<int:sensor_id>/data')
class Data(Resource):
    def get(self, sensor_id: int):
        return jsonify(api.get_sensor_data(sensor_id))
