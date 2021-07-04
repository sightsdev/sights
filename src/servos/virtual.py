# Virtual motor connection
from servo_wrapper import ServoWrapper, ServoModel


class VirtualConnection(ServoWrapper):
    # What type of motor this wrapper handles
    type_ = 'virtual'

    def __init__(self, config):
        ServoWrapper.__init__(self, config)

    def create_servo_model(self, channel, config, part=None):
        return ServoModel(channel, config["speed"], config["neutral"], part=part)

    def go_to(self, channel, pos):
        pass

    def stop(self, channel=None):
        pass

    def close(self):
        pass
