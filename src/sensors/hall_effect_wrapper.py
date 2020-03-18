from sensor_wrapper import SensorWrapper

# Try importing the RPi GPIO module but don't throw an error if it fails, instead try to import the Jetson one
try:
    import RPi.GPIO as GPIO                   
except ImportError:
    # If this fails too, throw an error
    import Jetson.GPIO as GPIO

class HallEffectWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'hall_effect'
    
    def __init__(self, config):
        SensorWrapper.__init__(self, config)

        # Get assigned pin that hall effect sensor is attached to
        self.pin = config.get(int("pin"), 17)
        # Setup GPIO
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        #GPIO.add_event_detect(self.pin, GPIO.BOTH, callback=sensorCallback, bouncetime=200)

    def get_data(self):
        return GPIO.input(self.pin)

    def close(self):
        GPIO.cleanup(self.pin)
