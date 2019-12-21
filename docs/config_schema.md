# Configuration file options

Configuration files contain the following options:

## `network`

`ip`

The ip address of the robot (e.g. 10.0.0.3). The WebSocket server and client will attempt to bind to this address.

It can be set to '*' to bind to any available address.

## `control`

`default_gamepad_speed`

Default gamepad speed option between 1 and 8.

`default_keyboard_speed`

Default keyboard speed option between 1 and 8.

## `motors`

`type`

Type of motor connection to use. Available options:

- `dynamixel` for Dynamixel AX-series servos
- `serial` for Sabertooth motor controllers
- `virtual` for a virtual motor connection (for testing)

`port`

Serial port to connect over (e.g. `/dev/ttyACM0`).

_Not required for virtual connection._

`baudrate`

Baudrate to connect to the specified serial port with.

_Not required for virtual connection._

`ids`

Configure Dynamixel ID assignment for each motor group. Currently only `left` and `right` groups are supported which define which servos are on the left and right side. Each group is a list, allowing for multiple motors.

_Only required for Dynamixel connection._

## `cameras`

For each camera, if the `enabled` option is set, it will be shown on the interface. The URL that the interface will attempt to load the camera stream from is defined in the `id` option. Note that these settings don't modify the Motion settings, and are meant to be set to whatever has been set in the relevant Motion config files.

## `sensors`

Array of sensors. Each sensor can have a number of different configuration options but for every sensor, the required fields are:

- `type`: the type of sensor (i.e. the model name)
- `enabled`: whether or not the sensor is enabled
- `name`: fancy display name
- `frequency`: how often the sensor is polled (in seconds)

Some sensors will have an additional options such as an `address` option to set the I²C address.

## `debug`

`log_level`

Takes one of the following string values, to specify the log types that are shown in the log file and log window. Anything lower than the specified level is not logged.

- `critical`
- `error`
- `warning`
- `info` (_default_)
- `debug`

`print_messages`

Log any messages received from the interface, and any data received from the sensors to be sent to the interface.
