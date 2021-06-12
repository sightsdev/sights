# Changelog {docsify-ignore-all}
## [v1.3](https://github.com/sightsdev/sights/releases/tag/v1.3) (2020-12-20)

### Features

- Added support for building Motion from source in the installer. This implements Motion support for the Nvidia Jetson. Prebuilt packages are still available for the Raspberry Pi and x64 based systems.
- Added sensor wrappers for MLX9064x 32x24 and 16x12 thermal cameras (#86)
- Added support for Ubuntu 20.04 (#94)

### Improvements

- Improved the formatting of the welcome message in the installer
- Added CTRL+S as a way to save modified config files in the interface
- Added keyboard shortcuts to open each modal
- Use Font Awesome for the speed buttons rather than unicode
- Renamed SSH to Terminal in the interface
- Only run apt update once during the install process

### Bug fixes
- Gamepad page tries to load a non-minifed script that no longer exists
- Host service fails to start when the motor type is set to the incorrectly named "serial" option.

## [v1.2](https://github.com/sightsdev/sights/releases/tag/v1.2) (2020-04-10)

A special thank you to @matt-w99 for his first contribution to SIGHTS on GitHub!

### Features

- Add support for GPIO digital switch devices (a basic button or even a hall effect switch) as sensors
- Notify the user if there are unsaved config changes when the config modal is closed and when the page is refreshed or closed
- Add support for accent colour theming (#72, #75)

### Improvements

- Reorganise JS folder for the interface. SIGHTS code is now separate from external libraries (#68, #69)
- Improve and minify gamepad.js. We now maintain a fork of this, along with a few modified libraries. Additional docs explain these changes. (#68, #69)
- Input improvements (#71):
  - Allow key repeats for more ergonomic speed change on the interface
  - Return to the last function when the current key is released if multiple keys are pressed.
  - Use gamepad left and right for speed changes (rather than up or down)
  - Merge speed indicators with the ability to change speed through interface buttons as well
- Update JS libraries including Bootstrap and Highlight.js (#68, #69)
- Change Highlight.js theme from Monokai to Railscasts (#68, #69)
- Unify the colour orange across the interface (#72, #75)
- Rename class Motors to MotorHandler, in line with its filename
- Add close function to SensorWrapper in case a sensor wrapper needs to close a connection or clean-up
- Open external links in a new tab
- Properly close update log filestream when an error occurs
- Remove legacy Arduino support
- Add tooltips to circle graphs (#78)
- Change the editable config to the active (selected) config rather than the currently running config
- Disable the delete button for both the running config in the event it is not the active config
- Condense regular and development update XMLRPC requests into a single function
- Notify the user when an update will require a host restart (#80)

### Bug fixes

- Update log is created in the root directory.
- Interface reports update failures as successes
- Interface reports shutdown/reboot successes as failures
- No spacing in SSH tabs
- Refreshing the page with a different active and running
config allows overwriting the running config with the active
config (#79)
- There are unsaved config changes when the interface is loaded while service is stopped (#79)

## [v1.1.1](https://github.com/sightsdev/sights/releases/tag/v1.1.1) (2020-03-03)

### Features

- Built-in updater allowing SIGHTS to be updated to release or development versions from within the interface

### Improvements

- CPU usage wrapper now reports a limit
- Demo mode is now only available when Supervisor is not
- Updater in install.sh now reconfigures Apache and Supervisor
- Simulation of sensors in demo mode now uses the demo config with variable periods
- Thermal camera is now animated in demo mode
- Removed unnecessary example configs to avoid overwriting user changes during updates. Replaced virtual.json with example.json

### Bug fixes

- Updater bundled with install.sh causes "no such file or directory" error
- Software version is not reported in the interface in v1.1
- Update checker fails in v1.1
- Secondary camera streams aren't visible when demo mode is first activated

## [v1.1](https://github.com/sightsdev/sights/releases/tag/v1.1) (2020-02-28)

### Features

- Added motor wrapper plugin system

### Improvements

This update merges the following repositories into a single `sights` repository:

- `SIGHTSRobot`
- `SIGHTSInterface`
- `supervisor_sights_config`

This allows far easier versioning, feature parity and updating, as well as simplifying the workflow on GitHub.

## [v1.0](https://github.com/sightsdev/sights/releases/tag/v1.0) (2020-02-10)

Initial public release
