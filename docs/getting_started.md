# Getting Started

## Requirements

Minimum supported operating systems:

- Ubuntu 18.04 LTS Bionic Beaver
- Debian 10 Buster
- Raspbian 10 Buster

Python >= 3.6 is required. All the officially supported distributions ship with Python 3.6+.

## Installation

To install on a robot, just download and run the installer as root:

```shell
wget https://raw.githubusercontent.com/sightsdev/sights/master/install.sh
chmod +x install.sh
sudo ./install.sh
```

Through the installer you can do a complete install, or just install and setup individual parts of the software suite.

```shell
SIGHTS installer

Detected OS: ubuntu bionic
Using a supported OS

1) Complete Install           6) Setup ShellInABox
2) Install Dependencies       7) Setup Supervisor
3) Install SIGHTS Software    8) Enable I2C
4) Setup Apache               9) Update
5) Setup Motion              10) Detect IPs
Enter a number (1-10) or q to quit:
```

For manual installation see [manual_install.md](manual_install.md).

Then visit the robot's IP address in any web browser on the same network.
