
# SART Integrated GUI and Host Teleoperation Service (SIGHTS)

[![Build status](https://img.shields.io/badge/build-passing-brightgreen)](https://www.sfxrescue.com)
[![GitHub license](https://img.shields.io/github/license/SFXRescue/SIGHTSRobot)](https://github.com/SFXRescue/SIGHTSRobot/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/SFXRescue/SIGHTSRobot)](https://github.com/SFXRescue/SIGHTSRobot/issues)
[![GitHub forks](https://img.shields.io/github/forks/SFXRescue/SIGHTSRobot)](https://github.com/SFXRescue/SIGHTSRobot/network)

SART Integrated GUI and Host Teleoperation Service (SIGHTS) is a complete service and control interface written by the Semi-Autonomous Rescue Team for the S.A.R.T. Mark III / IV rescue robots.

Features:

- Complete movement control with support for both Dynamixel servos and DC motors using a Sabertooth motor controller
- An extremely powerful web interface that allows the operator to control every aspect of the robot.
- TBC

All configuration for SIGHTS is done in the `.json` files within the `configs/` directory, which can be edited through the web interface. By default, the robot  will load the `default.json` config file but this can be changed through the interface. 

Configuration files for other software that SIGHTS uses can also be found in the `configs/` directory.

Python 3.6 or greater is required due to the use of `asyncio`.

Supported operating systems include Ubuntu and Debian.

Sensors are handled through a modular sensor management wrapper class, and are individually in the `Sensors/` directory. Arduino code for sensor data can be found in the `Arduino/` directory.

## Semi-Autonomous Installation

To install on a robot, just download and run the installer as root:

```sh
wget https://raw.githubusercontent.com/SFXRescue/SIGHTSRobot/master/install.sh
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

## Manual Installation

Installation is preferably done to the `/opt/sights/` directory. This was chosen to make it easier to manage running the software (e.g. making it run on boot) as putting it in the home folder can cause permission issues. [Supervisor](http://supervisord.org/) is used to manage running the SIGHTSRobot software.

### 1. Setting up the installation directory

First, you'll want to create that directory, and we'll make it owned by the current user for convenience:

```sh
sudo mkdir /opt/sights
sudo chown $USER:$USER /opt/sights
```

### 2. Downloading the software

Next clone this repository, as well as [`SIGHTSInterface`](https://github.com/SFXRescue/SIGHTSInterface).

```sh
cd /opt/sights
git clone https://github.com/SFXRescue/SIGHTSRobot
git clone https://github.com/SFXRescue/SIGHTSInterface
```

Then install SIGHTSRobot's dependencies with:

```sh
cd /opt/sights/SIGHTSRobot
python3 -m pip install -r requirements.txt
```

### 3. Setting up Apache

Apache should be configured to point to the `SIGHTSInterface` directory.

1. Install Apache2, if it's not already installed, with:

    ```sh
    sudo apt install apache2
    ```

2. Edit `/etc/apache2/apache2.conf` and add the following in the relevant section to allow Apache to access the `/opt/sights/` directory:

    ```xml
    <Directory /opt/sights/>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    ```

3. Copy the provided site file to the appropriate directory.

    ```sh
    sudo cp /opt/sights/SIGHTSRobot/configs/apache/SIGHTSInterface.conf /etc/apache2/sites-available/
    ```

    And then enable this site, and disable the default one, with

    ```sh
    sudo a2ensite SIGHTSInterface.conf
    sudo a2dissite 000-default.conf
    ```

    This file contains settings that tell the web server to host the SIGHTSInterface directory on port 80, and it also sets up some proxy paths which are used to redirect any requests to `:80/RPC2` to `:9001/RPC2` instead which is where Supervisor's API listens on.

4. Enable the reverse proxy modules, which we use to access Supervisor from the same origin.

    ```sh
    sudo a2enmod proxy
    sudo a2enmod proxy_http
    ```

5. Next, restart Apache2 with:

    ```sh
    sudo service apache2 restart
    ```

    Or you might need to start the service, if it hasn't been already:

    ```sh
    sudo service apache2 start
    ```

### 4. Setting up Motion

Motion version 4.2 or greater is required. Install the latest version of Motion from the [official repository](https://github.com/Motion-Project/motion).

For example, to download and install the 4.2.2 release for Ubuntu 18.04, do:

```sh
wget https://github.com/Motion-Project/motion/releases/download/release-4.2.2/bionic_motion_4.2.2-1_amd64.deb
sudo apt install ./bionic_motion_4.2.2-1_amd64.deb
```

The provided `motion.conf` file should be copied into the `/etc/motion/` directory.

```sh
sudo cp /opt/sights/SIGHTSRobot/configs/motion/motion.conf /etc/motion/
```

Keep in mind that this file points to the individual camera config files in `/opt/sights/SIGHTSRobot/configs/motion`.

Next, allow Motion to be run as a service by editing `/etc/default/motion` and changing `start_motion_daemon=no` to `start_motion_daemon=yes`.

Then enable the service with:

```sh
sudo systemctl enable motion
```

Reboot and ensure it is running with the command:

```sh
sudo service motion status
```

### 5. Setting up ShellInABox

[ShellInABox](https://github.com/shellinabox/shellinabox) is a web-based terminal emulator that is integrated into the interface to provide easy access to the underlying OS.

It can be installed with:

```sh
sudo apt install shellinabox
```

Since we're running only over a local network and don't want to use SSL, we can disable SSL by editing the `ShellInABox` config file:

```sh
sudo nano /etc/default/shellinabox
```

And changing the final line so it reads:

```sh
SHELLINABOX_ARGS="--no-beep --disable-ssl"
```

You can then start the service with:

```sh
sudo service shellinabox start
```

To test it out, navigate to `http://<robot_ip>:4200`

### 6. Running as a managed service with Supervisor

All we need to do now is ensure that `SIGHTSRobot`'s `manager.py` is run on boot as a managed service so we can start, stop and restart it at will.

For this, we'll use [Supervisor](http://supervisord.org/) which is a software package designed to manage (including starting/stopping/restarting) processes and also handle logging their output.

First install Supervisor with:

```sh
sudo -H python3 -m pip install supervisor
```

And then copy the provided configuration file to the relevant directory with:

```sh
sudo cp /opt/sights/SIGHTSRobot/configs/supervisor/supervisord.conf /etc/
```

Install the SIGHTS configuration file management Supervisor extension. This allows Supervisor to get and set the active config file and get a list of available config files.

```sh
cd /opt/sights/
git clone https://github.com/SFXRescue/supervisor_sights_config
cd supervisor_sights_config
python3 -m pip install .
```

The Supervisor daemon can now be run with

```sh
supervisord
```

This will automatically run the SIGHTSRobot process. You can manage this in a similar fashion to most unix services (such as Apache or Motion) with:

```sh
supervisorctl {start|stop|restart|status} sights
```

`supervisorctl` can also be run in interactive mode by running the command with no arguments.

Additionally, supervisor provides a web interface, which can be accessed at `http://<robot_ip>:9001`. It provides complete management of processes as well as an interface to view their logs.

To ensure that `supervisord` is run at boot, edit `/etc/rc.local` and add the following line _before_ the final line which should read `exit 0`:

```sh
supervisord
```

Note that `sudo` is not required, as `rc.local` is executed as the root user.

## Usage

If you don't wish to run it under supervisor, or simply wish to run it manually, you can do so with:

```sh
sudo python3 /opt/sights/SIGHTSRobot/manager.py
```

Other config files (default is `robot.json` in the `configs/` directory) can be loaded with the `-c` flag:

```sh
cd /opt/sights/SIGHTSRobot
sudo python3 manager.py -c configs/sabertooth.json
```

It will attempt to load the configuration file from the working directory.

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
