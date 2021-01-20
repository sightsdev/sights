from flask import request, jsonify, Response
from flask_restx import Namespace, Resource, fields
from sights.api import v1 as api

restapi = Namespace('cameras', description='Camera stream related operations')


@restapi.route('/')
class Cameras(Resource):
    def get(self):
        return [camera for camera in api._private.cameras]


@restapi.route('/<int:camera_id>/stream')
class Stream(Resource):
    def get(self, camera_id: int):
        """Video streaming route. Put this in the src attribute of an img tag."""
        return Response(api._private.create_camera(camera_id),
                        mimetype='multipart/x-mixed-replace; boundary=frame')


@restapi.route('/<int:camera_id>/resolution')
class CameraResolution(Resource):
    @restapi.expect(restapi.model('Resolution', {
        'width': fields.Integer,
        'height': fields.Integer,
    }))
    def post(self, camera_id: int):
        res = request.get_json()
        api._private.set_camera_resolution(camera_id, res["width"], res["height"])
        return '', 200

    def get(self, camera_id: int):
        res = api._private.get_camera_resolution(camera_id)
        return {
            "width": res[0],
            "height": res[1]
        }

@restapi.route('/<int:camera_id>/framerate')
class CameraFramerate(Resource):
    def post(self, camera_id: int):
        api._private.set_camera_framerate(camera_id, request.get_data())
        return '', 200

    def get(self, camera_id: int):
        return api._private.get_camera_framerate(camera_id)

