# Extending SIGHTS

SIGHTS is designed to be somewhat extensible.

## Adding new sensors

New sensors can be added by creating a new sensor wrapper. These reside within the `SIGHTSRobot/src/sensors` directory.

1. Download and install a compatible Python library

    Essentially, most standard sensor libraries will be compatible. Adafruit ones tend to be pretty well written and documented.

2. Create a sensor wrapper

    The sensor wrapper class is designed to be pretty broad in what it will support. If you can access a sensor through Python, you can wrap it within a sensor wrapper.

    Create a new file with an appropriate name in the `SIGHTSRobot/src/sensors` directory.

    Here's a (untested) example for the Adafruit BME280 using [this Adafruit library](https://github.com/adafruit/Adafruit_Python_BME280). Your file should like something like this:

    ```python
    from sensor_wrapper import SensorWrapper
    from Adafruit_BME280 import *

    # Unique name for the wrapper
    class BME280Wrapper(SensorWrapper):
        # The type of sensor this wrapper handles
        type_ = 'bme280'

        def __init__(self):
            SensorWrapper.__init__(self, bus)
            self.sensor = BME280(t_mode=BME280_OSAMPLE_8, p_mode=BME280_OSAMPLE_8, h_mode=BME280_OSAMPLE_8)

        def get_data(self):
            msg = {}

            # Temperature in degrees celcius
            temperature = self.sensor.read_temperature()
            msg["temperature"][0] = round(temperature, 2)

            # Pressure in hectopascals
            pressure = self.sensor.read_pressure() / 100
            msg["pressure"][0] = round(pressure, 2)

            # Humidity percentage
            humidity = self.sensor.read_humidity()
            msg["humidity"][0] = round(humidity, 2)

            return msg
    ```

    A more basic sensor could just return a single string or number value.

3. Add a section to your configuration files for your new sensor

    The only required options are whether the sensor is enabled, and how often to poll it. This would be sufficient for the above example.

    ```json
    {
        "type": "bme280",
        "name": "BME280 multi-sensor (front)",
        "enabled": true,
        "frequency": 3
    },
    ```

4. Add the interface side code.

    > This section is outdated, will be fixed shortly

    This is naturally very dependent on the type of sensor you are including. Essenitally, add the HTML code and then add an additional `if` statement for your sensor into the `SIGHTSInterface/js/sights.sensors.js` file. It should look something like this:

    ```js
    // Get temperature data for line graph
    if ("bme280" in obj) {
        var data = obj["bme280"];
        // Remove oldest element
        tempChartConfig.data.datasets[0].data.shift();
        // Push new element
        tempChartConfig.data.datasets[0].data.push(data[0]);
        // Update chart to display new data
        tempChart.update();
    }
    ```

5. Test it!

6. Submit a pull request so we can include your sensor wrapper in the upstream branch!

    We're always happy to merge pull requests that add features. Just make sure your code follows our guidelines!

    Check out our [contributing guidelines](https://github.com/SFXRescue/.github/blob/master/CONTRIBUTING.md) for more information about contributing to the SIGHTS project.

### Adding additional configuration options

You can add additional configuration options by overiding the `load_config` method in the sensor wrapper.

This is done in the included MLX90614 wrapper. For example to add an `address` option, the following is done.

```python
# Load config using inherited method, then also load additional value 'address'
def load_config(self, config):
    SensorWrapper.load_config(config)
    # i2c address
    self.address = config['address']
```

You could do the same to add an `accuracy` option (for example), as long as you have the corresponding key in the config file.

```python
self.accuracy = config['accuracy']
```

## Adding new motors

To add a new motor handler, a "Connection" class needs to be created within `motors.py`. This only needs a total of four functions.

```python
class ExampleConnection:
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.serial = ExampleClass()

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            # Send data to left motors
            pass
        # Right side
        if right is not None:
            # Send data to right motors
            pass

    def stop(self):
        # Stop all motors
        pass

    def close(self):
        # Close the connection
        pass
```

An example of this, is the SerialConnection class which is designed for Sabertooth motor controllers:

```python
class SerialConnection:
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.serial = serial.Serial(port=port, baudrate=baudrate)

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            msg = 64 + round(63 / 100 * max(min(left, 100), -100))
            self.serial.write(bytes([msg]))
        # Right side
        if right is not None:
            msg = 192 + round(63 / 100 * max(min(right, 100), -100))
            self.serial.write(bytes([msg]))

    def stop(self):
        self.serial.write(bytes([0]))

    def close(self):
        self.serial.close()
```

Then the relevant code has to be added to the `__init__()` function of the Motors class. Here you can designate a name for the type of connection, as specified in the configuration file (e.g. `dynamixel` or `serial`).

In the future, depending on demand, a plugin system similar to the sensor plugin system may be created to simplify and organise motor connection classes.
