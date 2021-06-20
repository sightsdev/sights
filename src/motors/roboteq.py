from motor_wrapper import MotorWrapper
import serial
import logging

class RoboteqConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'roboteq'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        from PyRoboteq import RoboteqHandler
        from PyRoboteq import roboteq_commands as cmds

        self.port = config.get('port')
        self.controller = RoboteqHandler(debug_mode = True, exit_on_interrupt = False)
        self.is_connected = self.controller.connect(self.port)
        self.channels = config.get('channels')
        try:
            self.channels.get('left')
            self.channels.get('right')
        except AttributeError:
            self.channels['left'] = 1
            self.channels['right'] = 0

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            self.controller.send_command(SET_SPEED, self.channels.get('left'), abs(round(1000 / 1024 * left)))
        # Right side
        if right is not None:
            self.controller.send_command(SET_SPEED, self.channels.get('right'), abs(round(1000 / 1024 * right)))

    def stop(self):
        self.controller.send_command(cmds.DUAL_DRIVE, 0, 0)

    def close(self):
        print("Not implemented")
