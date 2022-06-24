import logging
from sights.components.camera import Camera, CameraConfig
from sights.components.state import State

def list_all() -> list[Camera]:
    return [camera for camera in State.cameras.items()]

def create(config : CameraConfig) -> Camera:
    if (config.id in State.cameras):
        logging.error(f"Camera with id {config.id} already exists! Will not create a duplicate")
        return
    # Create an instance of the camera class
    camera = Camera(config)
    camera.start()
    State.cameras[config.id] = camera
    return camera

def stream(id: str):
    """Video streaming generator function."""
    camera = get(id)

    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def get(id: str) -> Camera:
    if id not in State.cameras:
        return 404
    return State.cameras[id]


def set_resolution(id: str, width: int, height: int):
    get(id).set_resolution(width, height)


def get_resolution(id: str):
    return get(id).get_resolution()


def set_framerate(id: str, framerate: int):
    get(id).set_framerate(framerate)


def get_framerate(id: str):
    return get(id).framerate
