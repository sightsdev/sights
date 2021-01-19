import os
import cv2
from .base_camera import BaseCamera


class Camera(BaseCamera):
    video_source = 0
    width = 640
    height = 480

    @staticmethod
    def set_video_source(source: int):
        Camera.video_source = source

    @staticmethod
    def frames():
        camera = cv2.VideoCapture(Camera.video_source)
        print(Camera.width)
        print(Camera.height)
        camera.set(3, float(Camera.width))
        camera.set(4, float(Camera.height))
        
        if not camera.isOpened():
            raise RuntimeError('Could not start camera.')

        while True:
            # read current frame
            _, img = camera.read()

            # encode as a jpeg image and return it
            yield cv2.imencode('.jpg', img)[1].tobytes()
