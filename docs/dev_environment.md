# Setting up a development environment

When developing for SIGHTS, it can be easier to work on a local development machine than having to develop on your robot through a remote connection.

SIGHTS can be installed and used on your development workstation. While we only officially support running on the Linux-based operating systems listed in [Getting Started](getting_started.md), SIGHTS can also be run from Windows, through [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

Setup is the same as it would be on the robot.

Known limitations of running in WSL:

- Hardware support is naturally limited, but most things do surprisingly work well
  - Cameras do not work as they cannot be accessed through WSL.
  - The CPU temp wrapper will not work, as `psutil` does not have this information available to it. This isn't a WSL issue, native `psutil` on Windows can't access it either.
  - Most motors controllers do work, as Windows passes COM ports through to WSL and they should be available as expected under `/dev/tty*`.
  - Physical sensor support through an i2c to USB board has not been tested. This is something we'd like to explore.
- Supervisor must be started manually, as WSL lacks systemd and will not run the Supervisor init script.
- Apache must also be started manually for the same reason.
- Shutdown and reboot functioality will not work as WSL cannot shut down the host.

Another option that can potentially allow for better hardware support is running Linux within a full virtual machine. Unlike WSL it is possible to get cameras working through this method. Since this setup will have systemd, SIGHTS should start on boot, and shutdown and reboot functionality is available.
