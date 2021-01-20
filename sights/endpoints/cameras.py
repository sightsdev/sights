from flask import Blueprint, request, jsonify, Response
from sights.components.camera import Camera
from flask_restplus import Resource, Api

cameras_blueprint = Blueprint('cameras_blueprint', __name__, url_prefix='/api/v1/cameras')
api = Api(cameras_blueprint)

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


@api.route('/<int:id>/stream')
class CameraStream(Resource):
    def get(self, id):
        """Video streaming route. Put this in the src attribute of an img tag."""
        return Response(create_camera(id),
            mimetype='multipart/x-mixed-replace; boundary=frame')

@api.route('/<int:id>/resolution')
class CameraResolution(Resource):
    def get(self, id):
        res = cameras[id].get_resolution()
        return jsonify({
            "width": res[0],
            "height": res[1]
        })
    def post(self, id):
        res = request.get_json()
        cameras[id].set_resolution(res["width"], res["height"])
        return '', 200

@api.route('/<int:id>/framerate')
class CameraFramerate(Resource):
    def get(self, id):
        return str(cameras[id].get_framerate())
    def post(self, id):
        cameras[id].set_framerate(request.get_data())
        return '', 200