from flask import request, jsonify, Response
from flask_restx import Namespace, Resource
from sights.components.camera import Camera

api = Namespace('cameras', description='Camera stream related operations')
cameras = []


def create_camera(camera_id):
    """Video streaming generator function."""
    camera = None
    for existing_camera in cameras:
        if existing_camera.video_source == camera_id:
            camera = existing_camera
    if not camera:
        camera = Camera()
        camera.start(video_source=camera_id)
        cameras.append(camera)

    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@api.route('/')
class Cameras(Resource):
    def get(self):
        return jsonify(cameras)


@api.route('/<int:camera_id>/stream')
class VideoFeed(Resource):
    def get(self, camera_id: int):
        """Video streaming route. Put this in the src attribute of an img tag."""
        return Response(create_camera(camera_id),
                        mimetype='multipart/x-mixed-replace; boundary=frame')


@api.route('/<int:camera_id>/resolution')
class CameraResolution(Resource):
    def post(self, camera_id: int):
        res = request.get_json()
        cameras[camera_id].set_resolution(res["width"], res["height"])
        return '', 200

    def get(self, camera_id: int):
        res = cameras[camera_id].get_resolution()
        return jsonify({
            "width": res[0],
            "height": res[1]
        })


@api.route('/<int:camera_id>/framerate')
class CameraFramerate(Resource):
    def post(self, camera_id: int):
        cameras[camera_id].set_framerate(request.get_data())
        return '', 200

    def get(self, camera_id: int):
        return str(cameras[camera_id].get_framerate())

