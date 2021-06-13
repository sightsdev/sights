from flask import jsonify
from flask_restx import Namespace, Resource
from sights.api import v1 as api

restapi = Namespace('plugins', description='Plugin related operations')


@restapi.route('/sensors')
class Sensors(Resource):
    def get(self):
        return api.plugins.list_all()
