from sights.components.camera import Camera
from sights.components.motor import Motor, Connection, MotorPlugin
from sights.components.sensor import Sensor, SensorPlugin

class State:
    motor_plugins: list[MotorPlugin] = {}
    sensor_plugins: list[SensorPlugin] = {}

    cameras: dict[int, Camera] = {}
    connections: dict[int, Connection] = {}
    motors: dict[int, Motor] = {}
    sensors: dict[int, Sensor] = {}
