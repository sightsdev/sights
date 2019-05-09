# S.A.R.T. Robot Arduino-side code
Arduino compatible sketches for various sensors used on the **S.A.R.T. Mark III robot.**

## SensorParty
This is the main production code that runs on the Arduino. This collects data from the following sensors and streams it over serial to the robot's main computer.
* **Adafruit VL53L0X** time-of-flight sensor
* **Adafruit SGP30** eC02 and TVOC sensor
* **Adafruit AMG8833** thermal camera

## DistanceParty
Just the **Adafruit VL53L0X** distance sensors

## Individual Sensors
These are useful for learning how to use multiple sensors together. Some of these such as _vl53_test_multi_ would likely be very helpful as the process for using multiple of these sensors is not as intuitive as you might expect.

### _amg_test_
Example script for Adafruit AMG8833 Thermal Camera

### _mlx_test_
Using MLX temperature sensor

### _mlx_test_multi_
Using multiple MLX temp sensors

### _serial_test_
Example on how to send data over serial

### _sgp_test_
Example script for Adafruit SGP30 eCO2 and TVOC sensor

### _vl_multi_test_
Using a mix of VL53 and VL61 distance sensors

### _vl53_test_
Example script for Adafruit VL53L0X

### _vl53_test_multi_
Using multiple Adafruit VL53L0X (this one's of interest)

### _vl61_test_
Example script for Adafruit VL6180X distance sensor

### _vl61_test_alt_
Alternative library, does same as vl61_test

### _vl61_test_alt_multi_
Multiple vl61 sensors using alt library