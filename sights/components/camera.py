from dataclasses import dataclass
import time
import threading

try:
    import cv2 
except ImportError:
    print("Could not import OpenCV")

try:
    from greenlet import getcurrent as get_ident
except ImportError:
    try:
        from thread import get_ident
    except ImportError:
        from _thread import get_ident

class CameraEvent(object):
    """An Event-like class that signals all active clients when a new frame is
    available.
    """
    def __init__(self):
        self.events = {}

    def wait(self):
        """Invoked from each client's thread to wait for the next frame."""
        ident = get_ident()
        if ident not in self.events:
            # this is a new client
            # add an entry for it in the self.events dict
            # each entry has two elements, a threading.Event() and a timestamp
            self.events[ident] = [threading.Event(), time.time()]
        return self.events[ident][0].wait()

    def set(self):
        """Invoked by the camera thread when a new frame is available."""
        now = time.time()
        remove = None
        for ident, event in self.events.items():
            if not event[0].isSet():
                # if this client's event is not set, then set it
                # also update the last set timestamp to now
                event[0].set()
                event[1] = now
            else:
                # if the client's event is already set, it means the client
                # did not process a previous frame
                # if the event stays set for more than 5 seconds, then assume
                # the client is gone and remove it
                if now - event[1] > 5:
                    remove = ident
        if remove:
            del self.events[remove]

    def clear(self):
        """Invoked from each client's thread after a frame was processed."""
        self.events[get_ident()][0].clear()

@dataclass
class CameraConfig:
    width: int
    height: int
    framerate: int
    source: int

class Camera:
    thread = None  # background thread that reads frames from camera
    frame = None  # current frame is stored here by background thread
    last_access = 0  # time of last client access to the camera
    event = CameraEvent()

    restart_event = threading.Event()

    config: CameraConfig = None

    def __init__(self, config):
        self.config = config

    def start(self):
        """Start the background camera thread if it isn't running yet."""
        if self.thread is None:
            self.last_access = time.time()

            # start background frame thread
            self.thread = threading.Thread(target=self._thread)
            self.thread.start()

            # wait until frames are available
            while self.get_frame() is None:
                time.sleep(0)

    def get_frame(self):
        """Return the current camera frame."""
        self.last_access = time.time()

        # wait for a signal from the camera thread
        self.event.wait()
        self.event.clear()

        return self.frame

    def set_video_source(self, source: int):
        self.config.source = source

    def restart(self):
        self.restart_event.set()
        self.thread.join()
        self.restart_event.clear()
        self.start()

    def set_resolution(self, width, height):
        """Set size of camera"""
        self.config.width = width
        self.config.height = height
        self.restart()

    def get_resolution(self): # -> (int, int):
        """Get resolution of camera"""
        return self.config.width, self.config.height

    def set_framerate(self, framerate):
        self.config.framerate = framerate
        self.restart()

    def get_framerate(self) -> int:
        return self.config.framerate

    def frames(self):
        cap = cv2.VideoCapture(self.config.source, cv2.CAP_DSHOW)

        # Resolution
        if self.config.width != 0 and self.config.height != 0:
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, float(self.config.width))
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, float(self.config.height))
        # Framerate
        if self.config.framerate != 0:
            cap.set(cv2.CAP_PROP_FPS, float(self.config.framerate))

        self.config.width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
        self.config.height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
        self.config.framerate = cap.get(cv2.CAP_PROP_FPS)

        if not cap.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            # read current frame
            _, img = cap.read()

            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()

    def _thread(self):
        """Camera background thread."""
        print('Starting camera thread.')
        frames_iterator = self.frames()
        for frame in frames_iterator:
            self.frame = frame
            self.event.set()  # send signal to clients
            time.sleep(0)

            # if there hasn't been any clients asking for frames in
            # the last 10 seconds then stop the thread
            if time.time() - self.last_access > 10:
                frames_iterator.close()
                print('Stopping camera thread due to inactivity.')
                break

            if self.restart_event.is_set():
                # If state has changed, break and restart
                print('State has changed. Stopping camera')
                break

        self.thread = None

