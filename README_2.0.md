

A few things to note:

There are a few main classes that are worth understanding.

## Motor
Defines an individual motor, servo or actuator.

## Connection
Defines a connection interface with a motor controller or similar. Generally this will be a serial port connection, or USB device on the server. A connection might (and usually will) have multiple Motors attached to it.

## Sensor
Some sort of input attached to the server. Generally these will connect via USB or GPIO pins (often using the I2C protocol)

## Camera
A video camera. Currently supports USB, but should work (or could work) with other protocols in the future.

For each of these classes, there is a corresponding "Config" class. For example, the `Motor` config class is called `MotorConfig`. The idea is that a `MotorConfig` object contains everything needed to initialize the `Motor` object. The idea is that this allows the user to edit a config and then the server can recreate the appropriate object.

# Plugins & API
The