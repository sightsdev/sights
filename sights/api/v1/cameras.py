from ._private import cameras
from ...components.camera import Camera


def create_camera(id):
    """Video streaming generator function."""
    camera = get_camera(id)

    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def get_camera(id):
    camera = None
    try:
        camera = cameras[id]
    except KeyError:
        camera = Camera()
        camera.start(video_source=id)
        cameras[id] = camera
    return camera


def set_camera_resolution(id, width, height):
    get_camera(id).set_resolution(width, height)


def get_camera_resolution(id):
    return get_camera(id).get_resolution()


def set_camera_framerate(id, framerate):
    get_camera(id).set_framerate(framerate)


def get_camera_framerate(id):
    return get_camera(id).get_framerate()
