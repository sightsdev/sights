
# SART Integrated GUI and Host Teleoperation Service (SIGHTS)

[![Build status](https://img.shields.io/badge/build-passing-brightgreen)](https://www.sfxrescue.com)
[![GitHub license](https://img.shields.io/github/license/SFXRescue/SIGHTSRobot)](https://github.com/SFXRescue/SIGHTSRobot/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/SFXRescue/SIGHTSRobot)](https://github.com/SFXRescue/SIGHTSRobot/issues)
[![GitHub forks](https://img.shields.io/github/forks/SFXRescue/SIGHTSRobot)](https://github.com/SFXRescue/SIGHTSRobot/network)

SART Integrated GUI and Host Teleoperation Service (SIGHTS) is a complete service and control interface written by the Semi-Autonomous Rescue Team for the S.A.R.T. Mark III / IV rescue robots.

![Screenshot](https://github.com/SFXRescue/SIGHTSInterface/blob/master/images/demo_screenshot_dark.png?raw=true "Screenshot of the interface")

Features:

- Complete motor control with support for both Dynamixel servos and DC motors using a Sabertooth motor controller.
  - Control the robot with a gamepad or keyboard from the interface
  - Assign different Dynamixel IDs to different parts of the robot (such as left and right drive servos)
  - Variable speed control
- All configuation is done through a single configuration file which can be edited, and swapped from the interface.
- Up to four video camera streams through [Motion](https://github.com/Motion-Project/motion).
- An extremely powerful [web interface](https://github.com/SFXRescue/SIGHTSInterface) that allows the operator to control every aspect of the robot.
  - Support for up to four video camera streams
  - Sensor graphs and displays for
    - Thermal camera
    - IR temperature sensor
    - Distance (Time of Flight) sensors
    - CO2 and TVOC sensor
    - System memory usage and core temperature
    - System uptime
  - Integrated tabbed SSH console
  - Full gamepad and keyboard support
  - Full visual configuration file editor and an advanced text-based editor
  - Configuration file management allowing you to swap the active configuration file at runtime
  - Light and dark theme modes
  - Allows the operator to shut down or restart the robot through the interface
- Sensor wrapper classes that can use existing Python libraries to access sensors over I2C.
- Built entirely using open protocols and open-source software.

All configuration for SIGHTS is done in the `.json` files within the `configs/` directory, which can be edited through the web interface. By default, the robot  will load the `default.json` config file but this can be changed through the interface.

Configuration files for other software that SIGHTS uses can also be found in the `configs/` directory.

## Requirements

Minimum supported operating systems:

- Debian 10 Buster
- Ubuntu 18.04 LTS
- Raspbian 10 Buster

Python >= 3.6 is required. All the supported distributions ship with Python 3.6+.

## Semi-Autonomous Installation

To install on a robot, just download and run the installer as root:

```sh
wget https://raw.githubusercontent.com/SFXRescue/SIGHTSRobot/master/install.sh
chmod +x install.sh
sudo ./install.sh
```

Through the installer you can do a complete install, or just install and setup parts of the software suite.

```sh
SIGHTS software installer

Detected OS: ubuntu bionic
Using a supported OS

1) Complete Install         4) Setup Apache           7) Setup Supervisor
2) Install Dependencies     5) Setup Motion           8) Update
3) Install SIGHTS Software  6) Setup ShellInABox
Enter a number (1-8) or q to quit:
```

For manual installation see [manual_install](docs/manual_install.md).

## Scripts

### `manager.py`

This is the main script that handles running the server and receiver. It essentially runs the `sensor_stream.py` and `control_receiver.py` scripts in parallel, and handles restarting those scripts as well as shutting down and rebooting the robot.

### `sensor_stream.py`

This is the server part of the software. This script handles getting various sensor data from the robot and connected Arduino or I²C devices, and then streaming it to the control panel via the WebSocket server. This includes all the data from the distance, temperature and gas sensors. It uses the Python module psutil to get the CPU usage, highest CPU core temperature, total RAM and current RAM usage from the board itself.

### `control_receiver.py`

This is the receiver part of the software. This script handles receiving information from the SIGHTSInterface. It runs a WebSocket client, which receives a JSON formatted string from the control panel. The string contains all the required data from the interface, including controller information, such as button and axis events. It processes this and using _servo_party.py_, calculates the appropriate speed and power distribution of the servos based on the thumb-stick or trigger values. This script also handles keyboard controls and various other messages from the interface, such as shutdown and reboot requests.

### `servo_party.py`

This script provides a reusable class to control the movement of the robot and is used by the control script and autonomy scripts. It manages connecting to the servos via the _pyax12_ library. It provides convenient functions for setting up and moving the servos as well as an option for virtual servos (useful for testing).

### `stop_servos.py`

This script will stop the motors from spinning. Although there is a failsafe in each of the main scripts that turns off the servos if the script stops, this provides a backup in case of an internal Python or system error.

### `auto_pid.py`

This script allows the robot to run in autonomous mode. It's in very early stages currently but in the future, it will allow the robot to navigate any of the main courses autonomously.

### `sensor_wrapper.py`

This is a class that the files in the `sensors/` directory are inherited from. It provides a standard set of methods that each 'wrapper' will use. A wrapper is created for each sensor connected to the robot. This is to provide a simple and modular way to handle the variety of ways in which all the different sensor libraries work.

### `websocket_process.py`

This isn't too important. It just provides a template for the SensorStream and ControlReceiver classes to inherit from. It establishes the WebSocket connection for each process.

## Configuration file options

Configuration files contain the following options:

### `network`

`ip`

The ip address of the robot (e.g. 10.0.0.3). The WebSocket server and client will attempt to bind to this address.

It can be set to '*' to bind to any available address.

### `control`

`default_gamepad_speed`

Default gamepad speed option between 1 and 8.

`default_keyboard_speed`

Default keyboard speed option between 1 and 8.

### `motors`

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

### `cameras`

For each camera, if the `enabled` option is set, it will be shown on the interface. The URL that the interface will attempt to load the camera stream from is defined in the `id` option. Note that these settings don't modify the Motion settings, and are meant to be set to whatever has been set in the relevant Motion config files.

### `sensors`

Each sensor will have _at least_ an `enabled` option, to enable the sensor, and a `frequency` option which defines (in seconds) how often the sensor is polled.

Some sensors will have an additional `address` option to set the I²C address.

### `debug`

`print_messages`

Print any messages received from the interface to the console.
