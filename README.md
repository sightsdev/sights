# SARTRobot
The scripts and programs written by the Semi-Autonomous Rescue Team for the S.A.R.T. Mark III / IV rescue robot.

The Python scripts require at least Python 3.6 due to it's use of _asyncio_.

All configuration for these scripts is done in `robot.json`, including com port settings,

Arduino code for sensor data can be found in the **_Arduino_** directory.

Configuration files for camera-streaming software _Motion_ can be found in the **_Motion_** directory. 

## Quick Installation
Clone this repository, as well as [`SARTInterface`](https://github.com/SFXRescue/SARTInterface). A web server (e.g. `apache2`) should be configured to point to the `SARTInterface` directory. 

Install the required packages with `pip3 install pyax12 websockets psutil` (non-exhaustive list)

The _Motion_ config files can be copied into the `~/.motion` directory and the _Motion_ daemon can then be started with `sudo motion`. A better option (in case the config files are updated) is to point to the config files in the repository either with a symlink or _Motion_'s `-c` option. 

The main program can be ran with `sudo python3 manager.py`.

## Scripts

### _servo_party.py_
This script provides a reusable class to control the movement of the robot and is used by the control script and autonomy scripts. It manages connecting to the servos via the _pyax12_ library. It provides convenient functions for setting up and moving the servos as well as an option for virtual servos (useful for testing).

### _control_receiver.py_
This script handles the movement of the robot via the SARTInterface. It runs a WebSocket client, which receives a JSON formatted string from the control panel. The string contains all the required data from the controller, such as what buttons are pressed and what position the thumb sticks and triggers are at. It processes this and calculates the appropriate speed and power distribution of the servos based on the thumb-stick or trigger values. The robot also supports keyboard controls. This script also handles various other messages from the interface, such as shutdown requests.

### _sensor_stream.py_
This script handles getting various sensor data from a connected Arduino, the i2c bus, and system data and then streaming it to the control panel via a WebSocket server. This includes all the data from the distance, temperature and gas sensors from the Arduino. It uses the Python module psutil to get the CPU usage, highest CPU core temperature, total RAM and current RAM usage from the board itself.

### _stop_servos.py_
In case of the all-to-common crash which leaves all the motors still spinning, this script will stop the motors from spinning. Although there is a failsafe in each of the main scripts that turns off the servos if the script stops, this provides a backup in case of an internal Python or system error.

### _auto_pid.py_
This script allows the robot to run in autonomous mode. It's in very early stages currently but in the future, it will allow the robot to navigate any of the main courses autonomously.
