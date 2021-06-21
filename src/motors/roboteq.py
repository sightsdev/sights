from motor_wrapper import MotorWrapper
from PyRoboteq import RoboteqHandler
from PyRoboteq import roboteq_commands as cmds


class RoboteqConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'roboteq'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)

        self.port = config.get('port')
        self.controller = RoboteqHandler(debug_mode=True, exit_on_interrupt=False)
        self.is_connected = self.controller.connect(self.port)
        self.channels = config.get('channels')
        try:
            self.channels.get('left')
            self.channels.get('right')
        except AttributeError:
            self.channels['left'] = 1
            self.channels['right'] = 0
        self.last_left = 0
        self.last_right = 0

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            self.last_left = round(1000 / 1024 * left)
        # Right side
        if right is not None:
            self.last_right = round(1000 / 1024 * right)
        self.controller.send_command(cmds.DUAL_DRIVE, self.last_left, self.last_right)

    def stop(self):
        self.controller.send_command(cmds.DUAL_DRIVE, 0, 0)

    def close(self):
        self.controller = None
