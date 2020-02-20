
# Motor handlers inherit this class
class MotorWrapper:
    def __init__(self):
        pass

    def move_raw(self, left=None, right=None):
        pass

    def stop(self):
        pass

    def close(self):
        pass