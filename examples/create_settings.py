

import jsonpickle
from sights.components.camera import Camera, CameraConfig

from sights.components.settings import Settings
from sights.plugins.random_sensor import RandomSensor, RandomSensorConfig

cameras = []#[CameraConfig("c0", 1920, 1080, 30, 0)]
motors = []
connections = []
sensors = [RandomSensorConfig(1, True, minimum=12, maximum=24)]

settings = Settings(cameras,motors,connections,sensors)

open("../sights/settings.json", "w").write(jsonpickle.encode(settings, indent=4))