from sights.api import v1 as api
from sights.components.motor import *
from dataclasses import dataclass


class SimpleSerialMotor(Motor):
    def __init__(self, connection: MotorConnection, channel: int):
        self.connection = connection
        self.channel = channel

    def move(self, speed):
        if self.enabled:
            self.connection.move_motor(self.channel, speed)


class SimpleSerialConnection(MotorConnection):
    def __init__(self, config):
        import serial
        MotorConnection.__init__(self, config)

        self.port = config.get('port')
        self.baudrate = config.get('baudrate')
        self.serial = serial.Serial(port=self.port, baudrate=self.baudrate)
        self.channels = config.get('channels')
        try:
            self.channels.get('left')
            self.channels.get('right')
        except AttributeError:
            self.channels['left'] = 1
            self.channels['right'] = 0

    def move_motor(self, channel, speed):
        # Left channel
        if channel == 0:
            offset = 64 if speed > 0 else 0
            channel = self.channels.get('left') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed))
            self.serial.write(bytes([msg]))
        # Right channel, note the intentional use of elif, since we want to ignore channels > 1
        elif channel == 1:
            offset = 64 if speed > 0 else 0
            channel = self.channels.get('right') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed))
            self.serial.write(bytes([msg]))

    def move(self, speed: List[int]):
        # Left side
        if speed[0] is not None:
            offset = 64 if speed[0] > 0 else 0
            channel = self.channels.get('left') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed[0]))
            self.serial.write(bytes([msg]))
        # Right side
        if speed[1] is not None:
            offset = 64 if speed[1] > 0 else 0
            channel = self.channels.get('right') * 128
            msg = offset + channel + abs(round(62 / 1000 * speed[1]))
            self.serial.write(bytes([msg]))

    def stop(self):
        self.serial.write(bytes([0]))

    def close(self):
        self.serial.close()


plugin = api.MotorPlugin(
    name="SimpleSerial",
    description="Simple Serial Connection",
    channels=2,
    connection_class=SimpleSerialConnection,
    motor_class=SimpleSerialMotor
)

api.plugins.register_motor_plugin(plugin)
