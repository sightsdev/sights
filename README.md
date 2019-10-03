# SARTRobot
The scripts and programs written by the Semi-Autonomous Rescue Team for the S.A.R.T. Mark III / IV rescue robot.

All configuration for these scripts is done in `default.json`, which can be edited through the web interface. The only configuration option that must be done manually is the robot's IP address, as that defines what address the WebSocket server will bind to.

Python 3.6 or greater is required due to the use of `asyncio`.

Sensors are handled through a modular sensor management wrapper class, and are individually in the `Sensors/` directory. Arduino code for sensor data can be found in the `Arduino/` directory.

Configuration files for camera-streaming software [Motion](https://github.com/Motion-Project/motion) can be found in the `Motion/` directory. 

## Installation
Installation is preferably done to the `/opt/sart` directory. This was chosen to make it easier to manage running the software (e.g. making it run on boot) as putting it in the home folder can cause permission issues.

### 1. Setting up the installation directory

First, you'll want to create that directory, and we'll make it owned by the `sart` user for convenience:
```sh
$ sudo mkdir /opt/sart
$ sudo chown sart:sart /opt/sart
```

### 2. Downloading the software

Next clone this repository, as well as [`SARTInterface`](https://github.com/SFXRescue/SARTInterface). 

```sh
$ cd /opt/sart
$ git clone https://github.com/SFXRescue/SARTRobot
$ git clone https://github.com/SFXRescue/SARTInterface
```

Then install SARTRobot's dependencies with:

```sh
$ cd /opt/sart/SARTRobot
$ python3 -m pip install -r requirements.txt
```

Edit `default.json` and change the value of `ip` to the robot's IP address:
```s
$ nano /opt/sart/SARTRobot/configs/default.json
```

```json
    "network": {
		"ip": "<robot_ip>"
	},
```

### 3. Setting up Apache2

A web server should be configured to point to the `SARTInterface` directory. I've chosen to use Apache2, but if you wish to use another (perhaps a more lightweight) webserver, you certainly can. Just configure it to point to `/opt/sart/SARTInterface`

1. Install Apache2 with:
    ```sh
    $ sudo apt install apache2
    ```

2. Edit `/etc/apache2/apache2.conf` and add the following in the relevant section to allow Apache to access the `/opt/sart/` directory:

    ```xml
    <Directory /opt/sart/>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>
    ```

3. Either create a new file in `/etc/apache2/sites-available` or edit the existing `000-default.conf` and change the `DocumentRoot` option, so it looks like this:

    ```xml
    <VirtualHost *:80>
        ServerAdmin webmaster@localhost
        DocumentRoot /opt/sart/SARTInterface

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>

    ```
    If you created a new file, you will need to enable it (and disable the default) with:
    ```sh
    $ sudo a2ensite <new_site>.conf
    $ sudo a2dissite 000-default.conf
    ```
4. Regardless of new file or old, you'll need to reload Apache2 with:
    ```sh
    $ sudo service apache2 reload
    ```
    Or you might need to start the service, if it hasn't been already:
    ```sh
    $ sudo service apache2 start
    ```
### 4. Setting up Motion

Motion version 4.2 or greater is required. Install the latest version of Motion from the [official repository](https://github.com/Motion-Project/motion).

For example, to download and install the 4.2.2 release for Ubuntu 18.04, do:
```sh
$ wget https://github.com/Motion-Project/motion/releases/download/release-4.2.2/bionic_motion_4.2.2-1_amd64.deb
$ sudo apt install ./bionic_motion_4.2.2-1_amd64.deb
```

The provided `motion.conf` file should be copied into the `/etc/motion/` directory.

```sh
$ sudo cp /opt/sart/SARTRobot/motion/motion.conf /etc/motion/
```

Keep in mind that this file points to the individual camera config files in `/opt/sart/SARTRobot/motion`.

Next, allow Motion to be run as a service by editing `/etc/default/motion` and changing `start_motion_daemon=no` to `start_motion_daemon=yes`.

Then enable the service with:

```sh
$ sudo systemctl enable motion
```

Reboot and ensure it is running with the command:
```sh
$ sudo service motion status
```

### 5. Setting up ShellInABox
[ShellInABox](https://github.com/shellinabox/shellinabox) is a web-based terminal emulator that is integrated into the interface to provide easy access to the underlying OS.

It can be installed with:
```sh
$ sudo apt install shellinabox
```
Since we're running only over a local network and don't want to use SSL, we can disable SSL by editing the `ShellInABox` config file:
```sh
$ sudo nano /etc/default/shellinabox
```
And changing the final line so it reads:
```sh
SHELLINABOX_ARGS="--no-beep --disable-ssl"
```
You can then start the service with:
```
$ sudo service shellinabox start
```
To test it out, navigate to `http://<robot_ip>:4200`

### 6. Running at boot

All we need to do now is ensure that `SARTRobot`'s `manager.py` runs on boot.

Keep in mind that `manager.py` needs to be run as root for shutdown and reboot functionality to work.

In the future, `manager.py` will be run as a service, but until then, the easiest method is to edit `/etc/rc.local` and add the following line _before_ the final line which should read `exit 0`

```sh
python3 /opt/sart/SARTRobot/manager.py
```

Note that `sudo` is not required, as `rc.local` is executed as the root user.

## Usage

If you don't wish to run it at boot, or simply wish to run it manually, you can, with:
```sh
sudo python3 /opt/sart/SARTRobot/manager.py
```
Other config files (default is `robot.json` in the configs directory) can be loaded with the `-c` flag:
```sh
cd /opt/sart/SARTRobot
sudo python3 manager.py -c configs/sabertooth.json
```
It will attempt to load the configuration file from the working directory.

## Scripts

### `manager.py`
This is the main script that handles running the server and receiver. It essentially runs the `sensor_stream.py` and `control_receiver.py` scripts in parallel, and handles restarting those scripts as well as shutting down and rebooting the robot.

### `sensor_stream.py`
This is the server part of the software. This script handles getting various sensor data from the robot and connected Arduino or I²C devices, and then streaming it to the control panel via the WebSocket server. This includes all the data from the distance, temperature and gas sensors. It uses the Python module psutil to get the CPU usage, highest CPU core temperature, total RAM and current RAM usage from the board itself.

### `control_receiver.py`
This is the receiver part of the software. This script handles receiving information from the SARTInterface. It runs a WebSocket client, which receives a JSON formatted string from the control panel. The string contains all the required data from the interface, including controller information, such as button and axis events. It processes this and using _servo_party.py_, calculates the appropriate speed and power distribution of the servos based on the thumb-stick or trigger values. This script also handles keyboard controls and various other messages from the interface, such as shutdown and reboot requests.

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

### `control`

`default_gamepad_speed`

Default gamepad speed option between 1 and 8.

`default_keyboard_speed`

Default keyboard speed option between 1 and 8.

### `servo`
>_Note: This may be renamed in the future to `motors`._

`type`

Type of servo connection to use. Available options:
- `dynamixel` for Dynamixel AX series servos
- `serial` for Sabertooth motor controllers
- `virtual` for a virtual servo connection (for testing)

`port`

Serial port to connect over (e.g. `/dev/ttyACM0`). Not required for virtual connection.

`baudrate`

Baudrate to connect to the specified serial port with. 

### `cameras`

For each camera, if the `enabled` option is set, it will be shown on the interface. The port that the interface will attempt to load the camera stream from is defined in the `port` option. Note that these settings don't modify the Motion settings, and are meant to be set to whatever has been set in the relevant Motion config files.

### `sensors`
Each sensor will have _at least_ an `enabled` option, to enable the sensor, and a `frequency` option which defines (in seconds) how often the sensor is polled.

Some sensors will have an additional `address` option to set the I<sup>2</sup>C address.

### `debug`
`print_messages`

Print any messages received from the interface to the console.
