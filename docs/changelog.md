# Changelog {docsify-ignore-all}

## [v1.1.1](https://github.com/SFXRescue/sights/releases/tag/v1.1.1) (2020-03-03)

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

## [v1.1](https://github.com/SFXRescue/sights/releases/tag/v1.1) (2020-02-28)

### Features

- Added motor wrapper plugin system

### Improvements

This update merges the following repositories into a single `sights` repository:

- `SIGHTSRobot`
- `SIGHTSInterface`
- `supervisor_sights_config`

This allows far easier versioning, feature parity and updating, as well as simplifying the workflow on GitHub.

## [v1.0](https://github.com/SFXRescue/sights/releases/tag/v1.0) (2020-02-10)

Initial public release
