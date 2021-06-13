from dataclasses import dataclass, field
from typing import Any
import jsonpickle

@dataclass
class Settings:
    cameras: dict[Any] = field(default_factory=dict)
    sensors: dict[Any] = field(default_factory=dict)
    motors: list[Any] = field(default_factory=list)

class State:
    def __init__(self, settings: Settings):
        State.sensors = settings.sensors
        State.motors = settings.motors
        State.cameras = settings.cameras
