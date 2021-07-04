import logging

class ServoModel:
    def __init__(self, channel, speed, neutral, pos=0, part=None):
        self.channel = channel
        self.speed = speed
        self.neutral = neutral
        self.pos = pos
        self.part = part

class ServoWrapper:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)

    def create_servo_model(self, channel, config, part=None):
        pass

    def go_to(self, channel, pos):
        pass

    def stop(self, channel=None):
        pass

    def close(self):
        pass
