from sights.components.camera import Camera, cameras


def stream(id):
    """Video streaming generator function."""
    camera = get(id)

    while True:
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


def list_all():
    return [camera for camera in cameras]


def get(id):
    camera = None
    try:
        camera = cameras[id]
    except KeyError:
        camera = Camera()
        camera.start(video_source=id)
        cameras[id] = camera
    return camera


def set_resolution(id, width, height):
    get(id).set_resolution(width, height)


def get_resolution(id):
    return get(id).get_resolution()


def set_framerate(id, framerate):
    get(id).set_framerate(framerate)


def get_framerate(id):
    return get(id).get_framerate()
