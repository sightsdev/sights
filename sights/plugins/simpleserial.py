from sights.api import v1 as api
from sights.components.motor import *
from dataclasses import dataclass

@dataclass
class SimpleSerialMotorConfig(MotorConfig):
    connection: Connection
    channel: int

class SimpleSerialMotor(Motor):
    def move(self, speed):
        if self.enabled:
            self.config.connection.move_motor(self.channel, speed)

    def stop(self):
        self.config.connection.move_motor(self.channel, 0)

@dataclass
class SimpleSerialConnectionConfig(ConnectionConfig):
    port: str
    baudrate: int
    channels: dict

class SimpleSerialConnection(Connection):
    def configure(self):
        import serial
        self.serial = serial.Serial(port=self.config.port, baudrate=self.config.baudrate)
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

    def move(self, speed: list[int]):
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
    connection_config=SimpleSerialConnectionConfig,
    motor_class=SimpleSerialMotor,
    motor_config=SimpleSerialMotorConfig
)

api.plugins.register_motor_plugin(plugin)
