# Design
This document is an informal collection of notes on the current architecture of Sights 2.0. Nothing here is set in stone, but may be of use to anyone who wishes to understand or contribute to the project. It will be adapted into Documentation closer to release.

## Plugins
Plugins are the main way Sights interfaces with hardware. They span a wide range of functionality but can be categorised as a Motor, Sensor, or Action/Script plugin. An installed package can contain multiple plugins.

### Sights Python API
The Sights Python API will expose most Sights functionality for use in plugins

### Classes
There are a few main classes that are worth understanding. These are:

**Motor**
Defines an individual motor, servo or actuator.

**Connection**
Defines a connection interface with a motor controller or similar. Generally this will be a serial port connection, or USB device on the server. A connection might (and usually will) have multiple Motors attached to it.

**Sensor**
Some sort of input attached to the server. Generally these will connect via USB or GPIO pins (often using the I2C protocol)

**Camera**
A video camera. Currently supports USB, but should work (or could work) with other protocols in the future.

For each of these classes, there is a corresponding "Config" class. For example, the `Motor` config class is called `MotorConfig`. The idea is that a `MotorConfig` object contains everything needed to initialize the `Motor` object. The idea is that this allows the user to edit a config and then the server can recreate the appropriate object.

### Motor plugins
Each motor plugin will contains a `MotorConnection` and `Motor` implementation. The intention is that the `MotorConnection` isn't really interacted with at all, and as such can be designed however the author pleases. Each `Motor` however should expose either a `set_speed` or `set_position` method (or both). The connection object shouldn't be used externally to control the motors.

The idea is that each Motor is abstracted from its Connection, allowing motor groups spanning multiple Connections.

### Motor groups
Controlling a motor individually can be a pain, and also dangerous. Motors are often grouped together (e.g. front and back motors on a tracked robot) and must be controlled in sync.

Motor groups will allow this in a really neat and extensible way, when implemented. Each motor group can be controlled much like an individual motor, including support for having 'reversed' motors.

### Scripts / Actions
Sights will support a type of plugin called an Action, or maybe called something else, who knows. It's essentially a normal python script that uses the Sights API.

An Action can extend Sights in any way imaginable. Think of it like a scripting language in a game engine. Here are a few examples of how it could be used:

**Autonomy**: Since the API exposes motor and sensor data, the robot can be directly controlled via a script. This could take all the input data, process it and guide the robot along a route.

**Arm control**: Although a lot of arm control will hopefully be built in, there are heaps of opportunities to add functionality. For example, having preset positions for an arm is useful, usually to home the arm. This could be implemented as a very simple action, it would just have to set the position of each servo to it's respective resting position.

**Warthog horn noise when you press the thumbstick button**: Relive the mid 2000s by adding custom Halo sound effects to your robot. 