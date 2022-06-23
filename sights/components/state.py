from dataclasses import dataclass, field
from typing import Any
from sights.components.camera import Camera
from sights.components.motor import Motor, MotorConnection, MotorPlugin
from sights.components.sensor import Sensor, SensorPlugin

class State:
    cameras: dict[Camera] = field(default_factory=dict)

    motor_plugins: dict[MotorPlugin] = {}
    motor_connections: dict[MotorConnection] = {}
    motors: dict[Motor] = {}

    sensor_plugins: dict[SensorPlugin] = {}
    sensors: dict[Sensor] = {}

