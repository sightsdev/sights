from sights.api import v1 as api
from sights.components.motor import *
import sights.plugins.dynamixel as dynamixel
import time

con = dynamixel.DynamixelConnection("/dev/ttyAMA0", 9600)

servoLeft  = dynamixel.DynamixelMotor(id=0, enabled=True, connection=con, channel=0)
servoRight = dynamixel.DynamixelMotor(id=1, enabled=True, connection=con, channel=1)

api.motors.create(servoLeft)
api.motors.create(servoRight)

servoLeft.set_speed(512)
servoRight.set_speed(512)

time.sleep(3)

servoLeft.set_speed(0)
servoRight.set_speed(512)

time.sleep(3)

