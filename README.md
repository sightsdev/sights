
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
SIGHTS installer

Detected OS: ubuntu bionic
Using a supported OS

1) Complete Install         4) Setup Apache           7) Setup Supervisor
2) Install Dependencies     5) Setup Motion           8) Update
3) Install SIGHTS Software  6) Setup ShellInABox
Enter a number (1-8) or q to quit:
```

For manual installation see [docs/manual_install.md](docs/manual_install.md).

Then visit the robot's IP address in any web browser on the same network.