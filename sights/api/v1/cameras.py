import logging
from sights.components.camera import Camera, CameraConfig
from sights.components.state import State

def list_all():
    return [camera for camera in State.cameras.items()]

def create(config : CameraConfig) -> Camera:
    if (config.id in State.cameras):
        logging.error(f"Camera with id {config.id} already exists! Will not create a duplicate")
        return
    # Create an instance of the camera class
    State.cameras[config.id] = Camera(config)
    return State.cameras[config.id]

def stream(id):
    """Video streaming generator function."""
    camera = get(id)

    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def get(id):
    # TODO get camera if exists
    camera = Camera()
    camera.config = State.cameras[id]
    camera.start()
    return camera


def set_resolution(id: str, width: int, height: int):
    get(id).set_resolution(width, height)


def get_resolution(id: str):
    return get(id).get_resolution()


def set_framerate(id: str, framerate: int):
    get(id).set_framerate(framerate)


def get_framerate(id: str):
    return get(id).framerate
