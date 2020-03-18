from sensor_wrapper import SensorWrapper

class HallEffectWrapper(SensorWrapper):
    # What type of sensor this wrapper handles
    type_ = 'hall_effect'
    
    def __init__(self, config):
        SensorWrapper.__init__(self, config)

        # Try importing the RPi GPIO module but don't throw an error if it fails, instead try to import the Jetson one
        # If that fails too, let it throw an error
        try:
            import RPi.GPIO as GPIO                   
        except ImportError:
            import Jetson.GPIO as GPIO

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
