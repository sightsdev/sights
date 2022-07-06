from flask import request, jsonify, Response
from flask_restx import Namespace, Resource, fields
from sights.api import v1 as api

restapi = Namespace('system', description='System related operations')


@restapi.route('/poweroff')
class Poweroff(Resource):
    def post(self):
        api.system.poweroff()

        
@restapi.route('/reboot')
class Reboot(Resource):
    def post(self):
        api.system.reboot()
