# Manual Installation

Installation is preferably done to the `/opt/sights/` directory. This was chosen to make it easier to manage running the software (e.g. making it run on boot) as putting it in the home folder can cause permission issues. [Supervisor](http://supervisord.org/) is used to manage running the SIGHTSRobot software.

## 1. Setting up the installation directory

First, you'll want to create that directory, and we'll make it owned by the current user for convenience:

```sh
sudo mkdir /opt/sights
sudo chown $USER:$USER /opt/sights
```

## 2. Downloading the software

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

## 3. Setting up Apache

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

## 4. Setting up Motion

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

## 5. Setting up ShellInABox

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

## 6. Running as a managed service with Supervisor

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
