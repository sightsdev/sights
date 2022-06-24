from flask import request
from flask_restx import Namespace, Resource
from sights.api import v1 as api
restapi = Namespace('motors', description='Motor related operations')


@restapi.route('/')
class HandleMotors(Resource):
    def get(self):
        return api.motors.list_all()
    def put(self):
        api.motors.create(request.get_json())
        return '', 204


@restapi.route('/<motor_id>/speed/<speed>')
class HandleMotorSpeed(Resource):
    def put(self, id: int, speed: int):
        api.motors.set_motor_speed(id, speed)


@restapi.route('/<motor_id>/position/<pos>')
class HandleSensorData(Resource):
    def put(self, id: int, pos: int):
        api.motors.set_motor_position(id, pos)
