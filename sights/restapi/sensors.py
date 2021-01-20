from flask import Blueprint, request, jsonify
from flask_restplus import Namespace, Resource
from sights.components.sensor import Sensors
from sights.api import v1 as papi

api = Namespace('sensors', description='Sensor related operations')


@api.route('/')
class Sensors(Resource):
    def get(self):
        sensors: Sensors = papi._private.sensors
        return jsonify([sensor for sensor in sensors])

    def put(self):
        papi.create_sensor(request.get_json())
        return '', 204


@api.route('/<int:sensor_id>')
class Sensor(Resource):
    def get(self, sensor_id: int):
        return jsonify(papi.get_sensor_info(sensor_id))


@api.route('<int:sensor_id>/data')
class Data(Resource):
    def get(self, sensor_id: int):
        return jsonify(papi.get_sensor_data(sensor_id))


@api.route('/api/v1/plugins/sensors/', methods=['GET'])
def plugins_sensors_all():
    sensor_plugins: Sensors = papi._private.sensor_plugins
    return jsonify([plugin for plugin in sensor_plugins])
