![Sights Logo](https://raw.githubusercontent.com/sightsdev/sights/master/docs/assets/sights.png)

[![Build status](https://img.shields.io/badge/build-passing-brightgreen)](https://www.sights.dev)
[![GitHub license](https://img.shields.io/github/license/sightsdev/sights)](https://github.com/sightsdev/sights/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/sightsdev/sights)](https://github.com/sightsdev/sights/issues)
[![GitHub forks](https://img.shields.io/github/forks/sightsdev/sights)](https://github.com/sightsdev/sights/network)

Sights is a complete teleoperation interface for a wide range of robotics hardware.

![Screenshot of the interface](https://github.com/sightsdev/sights/blob/master/docs/assets/interface-screenshot.jpg)

## Features

- All Sights configuration is done through a single configuration file which can be edited visually from within the interface, even if the Sights service is stopped or has crashed
- A powerful and extensible modular sensor system
  - A sensor plugin system to allow new sensors to be added with ease
  - Sensor wrapper classes that can use existing Python libraries to access sensors over I2C. No need to write libraries specifically for Sights
  - User can define which sensors are enabled, where they go on the interface, how they are displayed, and what type of graph they are displayed on
  - Sensors can be displayed on multiple graphs, or two sensors can be displayed on the same graph
  - Includes sensor plugins for:
    - Thermal cameras
    - Ambient and IR temperature sensors
    - Distance (Time of Flight) sensors
    - CO2 and TVOC sensors
    - System memory usage
    - CPU usage and temperature
    - System uptime
    - Disk space usage
  - Includes sensor graphs:
    - Line graph (supports multiple sensors on a single graph)
    - Percentage circle chart
    - Thermal camera with overlay features
    - Text box (with optional uptime display box)
- An extremely powerful interface that allows the operator to control every aspect of the robot
  - Up to four video camera streams through [Motion](https://github.com/Motion-Project/motion)
  - Integrated tabbed SSH console allowing advanced access to the underlying OS
  - Full gamepad and keyboard support
  - Full visual configuration file editor and an advanced text-based editor
  - Configuration file management allowing you to swap the active configuration file at runtime, even if the Sights service is stopped or has crashed
  - Keep track of old revisions of your config file to easily restore to a previous version
  - Light and dark themes
  - Ability for the operator to safely shut down or restart the robot through the interface
- Motor control with support for both Dynamixel AX-series servos and DC motors using a Sabertooth motor controller
  - Intuitive gamepad and keyboard control directly from the interface
  - Ability to assign different Dynamixel IDs to different groups, representing parts of the robot (such as left and right side servos)
  - Support for adding additional motor connection handlers in a similar manner to sensors
- Built entirely using open protocols and open-source software.

All configuration for Sights is done in the `.json` files within the `configs/` directory, which can be edited through the web interface. The active configuration file can be changed through the interface at any time, even if the Sights service is stopped or has crashed. This gives you the ability to fix any configuration issue without physical access to the robot.

## Requirements

Officially supported operating systems:

- Ubuntu 18.04 LTS Bionic Beaver
- Debian 10 Buster
- Raspbian 10 Buster

Python >= 3.6 is required. All the officially supported distributions ship with Python 3.6+.

## Installation

To install on a robot, just download and run the installer as root:

```shell
wget https://raw.githubusercontent.com/sightsdev/sights/master/install.sh
chmod +x install.sh
sudo ./install.sh
```

Through the installer you can do a complete install, or just install and setup individual parts of the software suite.

```shell
SIGHTS installer

Detected OS: ubuntu bionic
Using a supported OS

1) Complete Install           6) Setup ShellInABox
2) Install Dependencies       7) Setup Supervisor
3) Install Sights Software    8) Enable I2C
4) Setup Apache               9) Update
5) Setup Motion              10) Detect IPs
Enter a number (1-10) or q to quit:
```

For manual installation see [docs/manual_install.md](https://sightsdev.github.io/sights/#/manual_install).

Then visit the robot's IP address in any web browser on the same network.

## Documentation

Documentation can be found at [https://sights.js.org](https://sights.js.org).

It can also be accessed through the Sights interface itself, even without an internet connection.

## Contributing

If you have an idea, suggestion or bug report for the Sights project, or want to make a contribution of your own, we'd love to work with you to make it happen! Take a look at our [contributing page](https://github.com/sightsdev/.github/blob/master/CONTRIBUTING.md) for more information.
