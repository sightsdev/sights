# SARTRobot Mark III
The scripts and programs written by the Semi-Autonomous Rescue Team for the S.A.R.T. Mark III rescue robot.

Robot configuration such as servo COM port and IP address is done in _robot.cfg_

Arduino code for sensor data can be found in **_Arduino_**

Configuration files for camera-streaming software _Motion_ can be found in the **_Motion_** directory. 

## Scripts

### _servo_party.py_
This script provides a reusable class to control the movement of the robot and is used by the gamepad script and autonomy scripts. It manages connecting to the servos via the pyax12 library. It provides convenient functions for setting up and moving the servos.

### _control_gamepad.py_
This script handles the movement of the robot via gamepad. It runs a WebSocket client, which receives a JSON formatted string from the control panel. The string contains all the required data from the controller, such as what buttons are pressed and what position the thumb sticks and triggers are at. It processes this and calculates the appropriate speed and power distribution of the servos based on the thumb-stick or trigger values.

### _sensor_stream.py_
This script handles getting data from the onboard Arduino 101 and system data from the UDOO and then streaming it to the control panel via a WebSocket server. This includes all the data from the distance, temperature and gas sensors from the Arduino. It uses the Python module psutil to get the CPU usage, highest CPU core temperature, total RAM and current RAM usage from the UDOO itself.

### _stop_servos.py_
In case of the all-to-common crash which leaves all the motors still spinning, this script will stop the motors from spinning. Although there is a failsafe in each of the main scripts that turns off the servos if the script stops, this provides a backup in case of an internal Python or system error.

### _auto_pid.py_
This script allows the robot to run in autonomous mode. It’s in very early stages currently but in the future, it will allow the robot to navigate any of the main courses autonomously.
