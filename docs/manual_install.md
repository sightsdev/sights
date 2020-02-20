# Manual Installation

> This page is maintained for posterity, however small changes in installation instructions may escape future revisions. The most up-to-date installation instructions can always be inferred by reading the current [install.sh](https://github.com/SFXRescue/SIGHTSRobot/blob/master/install.sh) script.

Installation is preferably done to the `/opt/sights/` directory. This was chosen to make it easier to manage running the software (e.g. making it run on boot) as putting it in the home folder can cause permission issues. Installing to other locations will require changes to various config files.

[Supervisor](http://supervisord.org/) is used to manage running the SIGHTSRobot software.

## Preparing the installation directory

First, you'll want to create the aforementioned directory, and we'll make it owned by the current user for convenience:

```shell
sudo mkdir /opt/sights
sudo chown $USER:$USER /opt/sights
```

## Downloading the software

Next clone this repository, as well as [`SIGHTSInterface`](https://github.com/SFXRescue/SIGHTSInterface).

```shell
cd /opt/sights
git clone https://github.com/SFXRescue/SIGHTSRobot
git clone https://github.com/SFXRescue/SIGHTSInterface
```

Install the required packages:

```shell
sudo apt install git apache2 python3 python3-pip wget gdebi
```

Then install the Python dependencies with:

```shell
cd /opt/sights/SIGHTSRobot/src
python3 -m pip install -r requirements.txt
```

## Setting up Apache

Apache should be configured to point to the `SIGHTSInterface` directory.

Edit `/etc/apache2/apache2.conf` and add the following in the relevant section to allow Apache to access the `/opt/sights/` directory:

```xml
<Directory /opt/sights/>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>
```

Copy the provided site file to the appropriate directory.

```shell
sudo cp /opt/sights/SIGHTSRobot/src/configs/apache/SIGHTSInterface.conf /etc/apache2/sites-available/
```

And then enable this site, and disable the default one, with

```shell
sudo a2ensite SIGHTSInterface.conf
sudo a2dissite 000-default.conf
```

This file contains settings that tell the web server to host the SIGHTSInterface directory on port 80, and it also sets up some proxy paths which are used to redirect any requests to `:80/RPC2` to `:9001/RPC2` instead which is where Supervisor's API listens on. It does a similar thing for Motion to allow screenshot functionality.

Enable the reverse proxy modules, which we use to access Supervisor from the same origin.

```shell
sudo a2enmod proxy
sudo a2enmod proxy_http
```

Next, restart Apache2 with:

```shell
sudo service apache2 restart
```

Or you might need to start the service, if it hasn't been already:

```shell
sudo service apache2 start
```

## Setting up Motion

Motion version 4.2 or greater is required. Install the latest version of Motion from the [official repository](https://github.com/Motion-Project/motion).

For example, to download and install the 4.2.2 release for Ubuntu 18.04, do:

```shell
wget https://github.com/Motion-Project/motion/releases/download/release-4.2.2/bionic_motion_4.2.2-1_amd64.deb
sudo gdebi ./bionic_motion_4.2.2-1_amd64.deb
```

Create a symlink from `/etc/motion` to `/opt/sights/SIGHTSRobot/src/configs/motion/` for Motion config files.

```shell
rm -r /etc/motion
sudo ln -s /opt/sights/SIGHTSRobot/src/configs/motion /etc
```

Next, allow Motion to be run as a service by editing `/etc/default/motion` and changing `start_motion_daemon=no` to `start_motion_daemon=yes`.

Then enable the service with:

```shell
sudo systemctl enable motion
```

Reboot and ensure it is running with the command:

```shell
sudo service motion status
```

## Setting up ShellInABox

[ShellInABox](https://github.com/shellinabox/shellinabox) is a web-based terminal emulator that is integrated into the interface to provide easy access to the underlying OS.

It can be installed with:

```shell
sudo apt install shellinabox
```

Since we're running only over a local network and don't want to use SSL, we can disable SSL by editing the `ShellInABox` config file:

```shell
sudo nano /etc/default/shellinabox
```

And changing the final line so it reads:

```shell
SHELLINABOX_ARGS="--no-beep --disable-ssl"
```

On a Raspberry Pi you might need to enable SSH with:

```shell
sudo systemctl enable ssh
sudo systemctl start ssh
```

You can then start the service with:

```shell
sudo service shellinabox start
```

To test it out, navigate to `http://<robot_ip>:4200`

## Running as a managed service with Supervisor

All we need to do now is ensure that `SIGHTSRobot`'s `manager.py` is run on boot as a managed service so we can start, stop and restart it at will.

For this, we'll use [Supervisor](http://supervisord.org/) which is a software package designed to manage (including starting/stopping/restarting) processes and also handle logging their output.

First install Supervisor with:

```shell
sudo -H python3 -m pip install supervisor
```

Create a symlink for the Supervisor configuration file with:

```shell
sudo ln -sf /opt/sights/SIGHTSRobot/src/configs/supervisor /etc
```

Install the SIGHTS Supervisor extension. This allows Supervisor to manage configuration files, even when SIGHTS is not running.

```shell
cd /opt/sights/
git clone https://github.com/SFXRescue/supervisor_sights_config
cd supervisor_sights_config
python3 -m pip install .
```

Supervisor is now installed and set up.

To ensure that `supervisord` is run at boot, we will install a provided init script for Supervisor:

```shell
sudo cp SIGHTSRobot/src/configs/systemd/supervisord /etc/init.d/
sudo chmod 755 /etc/init.d/supervisord
sudo chown root:root /etc/init.d/supervisord
sudo update-rc.d supervisord defaults
```

## Usage

You can manage Supervisor with the usual service commands like:

```shell
sudo service supervisord {start|stop|restart|status}
```

You can manage the SIGHTS service in a similar fashion with:

```shell
sudo supervisorctl {start|stop|restart|status} sights
```

`supervisorctl` can also be run in interactive mode by running the command with no arguments.

Additionally, supervisor provides a web interface, which can be accessed at `http://<robot_ip>:9001`. It provides complete management of processes as well as an interface to view their logs, although most of this functionality has been integrated into the SIGHTS interface.
