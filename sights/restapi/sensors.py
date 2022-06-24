from flask import request
from flask_restx import Namespace, Resource
from sights.api import v1 as api
restapi = Namespace('sensors', description='Sensor related operations')


@restapi.route('/')
class HandleSensors(Resource):
    def get(self):
        return api.sensors.list_all()
    def put(self):
        api.sensors.create(request.get_json())
        return '', 204


@restapi.route('/<sensor_id>')
class HandleSensorInfo(Resource):
    def get(self, sensor_id: int):
        return api.sensors.get_info(sensor_id)


@restapi.route('/<sensor_id>/data')
class HandleSensorData(Resource):
    def get(self, sensor_id: int):
        result = api.sensors.get_data(sensor_id)
        if result is not None:
            return result
        else:
            return {'error': 'Sensor does not exist'}, 404
