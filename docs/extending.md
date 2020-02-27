# Extending SIGHTS

SIGHTS is designed to be modular and extensible. There are a number of ways you can extend SIGHTS to make it work with your hardware.

## Adding new sensors

New sensors can be added by creating a new sensor wrapper. These reside within the `sights/src/sensors` directory and inherit from the `SensorWrapper` class.

The purpose of a sensor wrapper is to implement a set of methods (`get_data()`, `get_initial()`, etc.) that are common to all sensor wrappers.

1. Download and install a compatible Python library

    Essentially, most standard sensor libraries will be compatible. Adafruit ones tend to be pretty well written and documented.

    Or write your own library, if you'd like.

2. Create a sensor wrapper

    The sensor wrapper class is designed to be pretty broad in what it will support. If you can access a sensor through Python, you can wrap it within a sensor wrapper.

    Create a new file with an appropriate name in the `sights/src/sensors` directory. It should follow the format of `<sensor_name>_wrapper.py`.

    Here's a (untested) example for the Adafruit BME280 using [this Adafruit library](https://github.com/adafruit/Adafruit_Python_BME280). Your file should like something like this:

    ```python
    # Import the SensorWrapper class that we inherit from
    from sensor_wrapper import SensorWrapper
    # Import the relevant library for the sensor
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

            # Temperature in degrees celsius
            temperature = self.sensor.read_temperature()
            msg["temperature"] = round(temperature, 2)

            # Pressure in hectopascals
            pressure = self.sensor.read_pressure() / 100
            msg["pressure"] = round(pressure, 2)

            # Humidity percentage
            humidity = self.sensor.read_humidity()
            msg["humidity"] = round(humidity, 2)

            return msg
    ```

    A more basic sensor could just return a single string or number value.

    Additionally a sensor wrapper can have a `get_initial()` function that is similar to `get_data()` but is only called once, during initialisation. This is useful for sending maximum values, or similar values that won't change. For example, it is used in the memory usage wrapper to send the total amount of RAM on the system, since this does not change.

3. Add a section to the config schema for your sensor.

    The interface can generate the necessary configuration file additions for your new sensor if you specify requirements in the schema located at `sights/interface/js/sights.config.schema.js`.

    Sensors are defined in the list `properties.sensors.items.anyOf`.

    The only required options are whether the sensor is enabled, the type, how often to poll it and its name (`sensor_wrapper.py`).

    For the BME280 sensor wrapper we created above, the following schema would be acceptable. Note how `display_on` is an object rather than an array. Since the BME280 sensor returns 3 values in its message, the interface needs to know where to display each one of the values. For a sensor that returns a single value, `display_on` is simply an array of strings representing graphs.

    ```json
    {
        "type": "object",
        "title": "BME280 (Temperature, Pressure, Humidity)",
        "options": {
            "collapsed": true
        },
        "properties": {
            "enabled": {
                "type": "boolean",
                "title": "Enable",
                "description": "Whether the MultiRandom sensor is enabled",
                "format": "checkbox",
                "default": true
            },
            "type": {
                "type": "string",
                "title": "Type",
                "enum": [
                    "multirandom"
                ],
                "default": "multirandom",
                "format": "radio"
            },
            "name": {
                "type": "string",
                "title": "Name",
                "description": "The pretty name for the MultiRandom sensor.",
                "default": "New Sensor"
            },
            "period": {
                "type": "number",
                "title": "Update Period",
                "description": "How often, in seconds, the MultiRandom sensor is polled.",
                "default": 3
            },
            "display_on": {
                "type": "object",
                "title": "Display On",
                "description": "The MultiRandom sensor is a multi-sensor. Choose how each value is displayed individually.",
                "options": {
                    "collapsed": false
                },
                "properties": {
                    "temperature": {
                        "type": "array",
                        "title": "Temperature",
                        "description": "A list of graph UIDs to display this sensor's temperature data on.",
                        "items": {
                            "type": "string",
                            "title": "Graph UID"
                        }
                    },
                    "pressure": {
                        "type": "array",
                        "title": "Pressure",
                        "description": "A list of graph UIDs to display this sensor's pressure data on.",
                        "items": {
                            "type": "string",
                            "title": "Graph UID"
                        }
                    },
                    "Humidity": {
                        "type": "array",
                        "title": "C",
                        "description": "A list of graph UIDs to display this sensor's humidity data on.",
                        "items": {
                            "type": "string",
                            "title": "Graph UID"
                        }
                    }
                }
            }
        }
    }
    ```

4. (Optional) Create a sensor graph.

    A sensor graph is a JavaScript class that determines how sensor data is displayed on the interface. In many cases, you may be able to use an existing graph to display the data from your new sensor.

    A new sensor graph class can extend the existing "abstract" class `Graph` (`sights/interface/js/graphs/graph.js`) for an easy framework to build your graph class around.

5. Add the sensor and it's corresponding graph to your config file.

    If you created the schema, following step 3, then you can create a new sensor through the visual editor in the interface. Otherwise, it can be created manually through the advanced editor.

    Also create a graph for the sensor data to be displayed on. If you created a new type of graph in step 4, you can use that one. Otherwise you can use one of the default graph types.

6. Test it!

7. Submit a pull request so we can include your sensor wrapper in the upstream branch!

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

Just make sure you have the corresponding key in your config file.

If you need your value to be a specific type, such as an integer, you can use Python's built in type casting operations:

```python
self.accuracy = int(config['accuracy'])
```

## Adding new motors

To add support for a new type of motor connection, a motor wrapper class needs to be created within the `motors/` directory, and needs to inherit from `MotorWrapper`. This only needs a total of four functions.

```python
class ExampleConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'example'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        # Load config options
        self.port = config.get('port')
        self.baudrate = config.get('baudrate')
        # Load an additional option
        self.additional_option = config.get('additional_option')
        # Create actual communication object, can be an external library
        self.serial = ExampleClass()

    def move_raw(self, left=None, right=None):
        # Left side
        if left is not None:
            # Send data to left motors
            self.serial.move_left(left)
        # Right side
        if right is not None:
            # Send data to right motors
            self.serial.move_right(right)

    def stop(self):
        # Stop all motors
        pass

    def close(self):
        # Close the connection
        pass
```

An example of this, is the SabertoothConnection class which is designed for Sabertooth motor controllers:

```python
class SabertoothConnection(MotorWrapper):
    # What type of motor this wrapper handles
    type_ = 'sabertooth'

    def __init__(self, config):
        MotorWrapper.__init__(self, config)
        self.port = config.get('port')
        self.baudrate = config.get('baudrate')
        # Try
        self.serial = serial.Serial(port=self.port, baudrate=self.baudrate)

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

Additional config options can be added as needed, as shown in the above examples.

Motor wrappers are loaded dynamically, just like sensor wrappers. Make sure your wrapper is in the right directory, update your config file, and you should be good to go.
