# Source code

## Directories

### `configs/`

Internal configs used by the installer and SIGHTS. Not intended to be modified by the user.

### `motors/`

Motor plugins for each type of motor connection. Additional motor plugins can be added here.

### `sensors/`

Sensor plugins for each I2C sensor class. Additional sensor plugins can be added here.

### `utils/`

Python scripts that are not part of normal operation. Mainly for edge cases such as fixing Dynamixel servos that have been disabled as a result of overheating.

## Scripts

### `main.py`

This is the main script that handles running the server and receiver. It essentially runs the `sensor_stream.py` and `control_receiver.py` scripts in parallel, and handles restarting those scripts as well as shutting down and rebooting the robot.

### `sensor_stream.py`

This is the server part of the software. This script handles getting various sensor data from the robot and I²C devices via the sensor plugins found in the `sensors/` directory. It handles streaming it to the control panel via the WebSocket server.

### `control_receiver.py`

This is the receiver part of the software. This script handles receiving information from the SIGHTS interface. It runs a WebSocket client, which receives a JSON formatted string from the control panel. The string contains all the required data from the interface, including controller information, such as button and axis events. It processes this and using _motors.py_, calculates the appropriate speed and power distribution of the servos based on the thumb-stick or trigger values. This script also handles keyboard controls and various other messages from the interface, such as shutdown and reboot requests.

### `motor_handler.py`

This script provides a reusable class to control the movement of the robot and is used by the control script.

### `plugin_system.py`

This provides a generic plugin system used by both `sensor_stream.py` and `motor_handler.py`. It dynamically loads .py files that contain a certain class from a certain directory.

### `motor_wrapper.py`

This is a class that the files in the `motors/` directory are inherited from. It provides a standard set of methods that each plugin will use. A wrapper is created for each type of motor connection that SIGHTS supports.

### `sensor_wrapper.py`

This is a class that the files in the `sensors/` directory are inherited from. It provides a standard set of methods that each plugin will use. A wrapper is created for each sensor connected to the robot. This is to provide a simple and modular way to handle the variety of ways in which all the different sensor libraries work.

### `websocket_process.py`

This isn't too important. It just provides a template for the SensorStream and ControlReceiver classes to inherit from. It establishes the WebSocket connection for each process.

## Util scripts

### `auto_pid.py`

This script allows the robot to run in autonomous mode. It's in very early stages currently but in the future, it will allow the robot to navigate any of the main courses autonomously.

### `unfck_motors.py`

This script should hopefully re-enable dynamixel servos if they overload, and clear errors.

### `stop_servos.py`

This script will stop the motors from spinning. Although there is a failsafe in each of the main scripts that turns off the servos if the script stops, this provides a backup in case of an internal Python or system error.
