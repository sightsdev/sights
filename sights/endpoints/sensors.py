from flask import Blueprint, request, jsonify
from sights.components.sensor import Sensors
from sights.api import v1 as api

sensors_blueprint = Blueprint('sensors_blueprint', __name__)


@sensors_blueprint.route('/api/v1/sensors', methods=['GET'])
def sensors_all():
    sensors: Sensors = api._private.sensors
    return jsonify([sensor for sensor in sensors])


@sensors_blueprint.route('/api/v1/sensors/<int:sensor_id>', methods=['GET'])
def sensors_id(sensor_id: int):
    return jsonify(api.get_sensor_info(sensor_id))


@sensors_blueprint.route('/api/v1/sensors/<int:sensor_id>/data', methods=['GET'])
def sensors_data(sensor_id: int):
    return jsonify(api.get_sensor_data(sensor_id))


@sensors_blueprint.route('/api/v1/sensors', methods=['PUT'])
def create_sensor():
    api.create_sensor(request.get_json())
    return '', 204


@sensors_blueprint.route('/api/v1/plugins/sensors/', methods=['GET'])
def plugins_sensors_all():
    sensor_plugins: Sensors = api._private.sensor_plugins
    return jsonify([plugin for plugin in sensor_plugins])
