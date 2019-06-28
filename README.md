# SARTRobot Mark III
The scripts and programs written by the Semi-Autonomous Rescue Team for the S.A.R.T. Mark III rescue robot. Designed to work with the UDOO x86 Ultra as a main control board, but easily adapted to other boards.

The Python scripts require at least Python 3.6 due to it's use of _asyncio_.

Robot configuration such as servo COM port and IP address is done in `robot.cfg`.

Arduino code for sensor data can be found in `Arduino`

Configuration files for camera-streaming software _Motion_ can be found in `Motion`. 


## Quick Installation
Clone this repository, as well as [`SARTInterface`](https://github.com/SFXRescue/SARTInterface). A web server (e.g. `apache2`) should be configured to point to the `SARTInterface` directory. 

Install the required packages with `pip3 install pyax12 websockets psutil`

The _Motion_ config files can be copied into the `~/.motion` directory and the _Motion_ daemon can then be started with `sudo motion`. A better option (in case the config files are updated) is to point to the config files in the repository either with a symlink or _Motion_'s `-c` option. 

The main scripts can be ran with `python3 control_gamepad.py & python3 sensor_stream.py`.

## Scripts

### _servo_party.py_
This script provides a reusable class to control the movement of the robot and is used by the gamepad script and autonomy scripts. It manages connecting to the servos via the _pyax12_ library. It provides convenient functions for setting up and moving the servos.

### _control_gamepad.py_
This script handles the movement of the robot via gamepad. It runs a WebSocket client, which receives a JSON formatted string from the control panel. The string contains all the required data from the controller, such as what buttons are pressed and what position the thumb sticks and triggers are at. It processes this and calculates the appropriate speed and power distribution of the servos based on the thumb-stick or trigger values.

### _sensor_stream.py_
This script handles getting data from the onboard Arduino 101 and system data from the UDOO and then streaming it to the control panel via a WebSocket server. This includes all the data from the distance, temperature and gas sensors from the Arduino. It uses the Python module psutil to get the CPU usage, highest CPU core temperature, total RAM and current RAM usage from the UDOO itself.
This is fairly specific to the sensors used and the UDOO x86 (due to it's built in Arduino) but can be easily modified for other boards. In fact, using the built-in native i2c pins on most SoC boards (Raspberry Pi, Nvidia Jetson, etc.) is far superior to using the Arduino like we did here.

### _stop_servos.py_
In case of the all-to-common crash which leaves all the motors still spinning, this script will stop the motors from spinning. Although there is a failsafe in each of the main scripts that turns off the servos if the script stops, this provides a backup in case of an internal Python or system error.

### _auto_pid.py_
This script allows the robot to run in autonomous mode. It's in very early stages currently but in the future, it will allow the robot to navigate any of the main courses autonomously.

