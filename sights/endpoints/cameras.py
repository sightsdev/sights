from flask import Blueprint, request, jsonify, Response
from sights.components.camera import Camera

cameras_blueprint = Blueprint('cameras_blueprint', __name__)
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


@cameras_blueprint.route('/stream/<int:camera_id>')
def video_feed(camera_id: int):
    """Video streaming route. Put this in the src attribute of an img tag."""
    try:
        camera_id = int(camera_id)
    except ValueError:
        return f"ValueError: Expected integer video device ID, given {camera_id}"
    return Response(create_camera(camera_id),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@cameras_blueprint.route('/api/v1/cameras/<int:camera_id>/resolution', methods=['POST'])
def set_camera_resolution(camera_id: int):
    res = request.get_json()
    cameras[camera_id].set_resolution(res["width"], res["height"])
    return '', 200


@cameras_blueprint.route('/api/v1/cameras/<int:camera_id>/resolution', methods=['GET'])
def get_camera_resolution(camera_id: int):
    res = cameras[camera_id].get_resolution()
    return jsonify({
        "width": res[0],
        "height": res[1]
    })


@cameras_blueprint.route('/api/v1/cameras/<int:camera_id>/framerate', methods=['POST'])
def set_camera_framerate(camera_id: int):
    cameras[camera_id].set_framerate(request.get_data())
    return '', 200


@cameras_blueprint.route('/api/v1/cameras/<int:camera_id>/framerate', methods=['GET'])
def get_camera_framerate(camera_id: int):
    return str(cameras[camera_id].get_framerate())
