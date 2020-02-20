# Virtual motor connection
from motor_wrapper import MotorWrapper

class VirtualConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'virtual'

    def __init__(self):
        pass

    def move_raw(self, left=None, right=None):
        pass

    def stop(self):
        pass

    def close(self):
        pass