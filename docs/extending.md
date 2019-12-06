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
        # The key for this sensor that configuation files use
        _key = 'bme280'

        def __init__(self):
            SensorWrapper.__init__(self, bus)
            self.sensor = BME280(t_mode=BME280_OSAMPLE_8, p_mode=BME280_OSAMPLE_8, h_mode=BME280_OSAMPLE_8)

        def get_data(self):
            msg = {}

            # Temperature in degrees celcius
            temperature = self.sensor.read_temperature()
            msg["temp"][0] = round(temperature, 2)

            # Pressure in hectopascals
            pressure = self.sensor.read_pressure() / 100
            msg["pressure"][0] = round(pressure, 2)

            # Humidity percentage
            humidity = self.sensor.read_humidity()
            msg["humidity"][0] = round(humidity, 2)

            return msg
    ```

3. Add a section to your configuration files for your new sensor

    The only required options are whether the sensor is enabled, and how often to poll it. This would be sufficient for the above example.

    ```json
    "bme280": {
        "enabled": true,
        "frequency": 3
    },
    ```

4. Enable the sensor manually in `sensor_stream.py` until we fix that.

    At the moment, you need to add this to the init function of SensorStream. This will be fixed very soon, I promise.

    ```python
    self.sensors.append(BME280Wrapper())
    ```

    This will be done automatically in a nearby future update.

### Adding additional configuration options

You can add additional configuration options by overiding the `load_config` method in the sensor wrapper.

This is done in the included MLX90614 wrapper. For example to add an `address` option, the following is done.

```python
# Load config using inherited method, then also load additional value 'address'
def load_config(self, config):
    SensorWrapper.load_config(config)
    # i2c address
    self.address = config[self._key]['address']
```

You could do the same to add an `accuracy` option (for example), as long as you have the corresponding key in the config file.

```python
self.accuracy = config[self._key]['accuracy']
```
