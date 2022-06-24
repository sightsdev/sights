from sights.api import v1 as api
from sights.components.motor import *
from sights.plugins.dynamixel import DynamixelConnection, DynamixelConnectionConfig, DynamixelMotor, DynamixelMotorConfig
import time

# Note that we use the api to create the Dynamixel Connection object. 
# You could create it directly but using the create function also 
# registers it with the api, making it available to other plugins etc
connection : DynamixelConnection = api.connections.create(DynamixelConnectionConfig("/dev/ttyAMA0", 9600))

# Creating the individual config options first (similar to loading them from a config file)
servoLeftConfig  = DynamixelMotorConfig(id=0, enabled=True, connection=connection, channel=0)
servoRightConfig = DynamixelMotorConfig(id=1, enabled=True, connection=connection, channel=1)

# Then creating the actual motor objects 
servoLeft : DynamixelMotor  = api.motors.create(servoLeftConfig)
servoRight : DynamixelMotor = api.motors.create(servoRightConfig)

# Now they can be directly controlled
servoLeft.set_speed(512)
servoRight.set_speed(512)

time.sleep(3)

servoLeft.set_speed(0)
servoRight.set_speed(512)

time.sleep(3)

# Normally motors are controlled via their Motor object and not their Connection object
# As we abstract the idea of Motors to make them Connection-independent
# However, for safety, the following method exists:
connection.stop()