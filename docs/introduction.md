
# Introduction

Sights is a complete teleoperation interface for a wide range of robotics hardware.

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
- An extremely powerful web interface that allows the operator to control every aspect of the robot
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

All configuration for Sights is done in a single `.json` file within the `configs/` directory, which can be edited through the web interface. Multiple of these config files can be kept for different configurations. The active configuration file can be changed through the interface at any time, even if the Sights service is stopped or has crashed. This gives you the ability to fix any configuration issue without physical access to the robot.
