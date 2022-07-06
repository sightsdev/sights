# Wrapper for simple serial motor controllers.
#
# Tested on Cytron SmartDriveDuo-30 MDDS30.
# Will also work with:
#  * Sabertooth motor controllers
#  * Any serial (not packetised) motor controller using the following schema:
# +---------------------------------------------+---------+----------------------------+
# |                    Binary                   |         |                            |
# +---------+-----------+-----------------------+         |                            |
# | Channel | Direction |         Speed         | Decimal |                            |
# +---------+-----------+---+---+---+---+---+---+         |                            |
# |    7    |     6     | 5 | 4 | 3 | 2 | 1 | 0 |         |                            |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    0    |     0     | 0 | 0 | 0 | 0 | 0 | 0 |    0    | motor LEFT stop            |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    0    |     0     | 1 | 1 | 1 | 1 | 1 | 1 |    63   | motor LEFT full speed CW   |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    0    |     1     | 0 | 0 | 0 | 0 | 0 | 0 |    64   | motor LEFT stop            |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    0    |     1     | 1 | 1 | 1 | 1 | 1 | 1 |   127   | motor LEFT full speed CCW  |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    1    |     0     | 0 | 0 | 0 | 0 | 0 | 0 |   128   | motor RIGHT stop           |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    1    |     0     | 1 | 1 | 1 | 1 | 1 | 1 |   191   | motor RIGHT full speed CW  |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    1    |     1     | 0 | 0 | 0 | 0 | 0 | 0 |   192   | motor RIGHT stop           |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+
# |    1    |     1     | 1 | 1 | 1 | 1 | 1 | 1 |   255   | motor RIGHT full speed CCW |
# +---------+-----------+---+---+---+---+---+---+---------+----------------------------+

from motor_wrapper import MotorWrapper
import serial
import logging


class SimpleSerialConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'simpleserial'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        self.port = config.get('port')
        self.baudrate = config.get('baudrate')
        self.serial = serial.Serial(port=self.port, baudrate=self.baudrate)

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            offset = 64 #if left > 0 else 0
            msg = offset + (round(62 / 1000 * left))
            self.serial.write(bytes([msg]))
        # Right side
        if right is not None:
            offset = 64 #if right > 0 else 0
            msg = offset + 128 + (round(62 / 1000 * right))
            self.serial.write(bytes([msg]))

    def stop(self):
        self.serial.write(bytes([0]))

    def close(self):
        self.serial.close()
