from dataclasses import dataclass
from sights.components.camera import CameraConfig
from sights.components.motor import ConnectionConfig, MotorConfig
from sights.components.sensor import SensorConfig

@dataclass
class Settings:
    cameras: list[CameraConfig] 
    motors: list[MotorConfig] 
    connections: list[ConnectionConfig]
    sensors: list[SensorConfig]
    