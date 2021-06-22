from servo_wrapper import ServoWrapper, ServoModel
import maestromaster.maestro as mae
import logging

class MaestroConnection(ServoWrapper):
    type_ = 'maestro'
    CENTRE = 6000
    RANGE = 3600

    def __init__(self, config):
        ServoWrapper.__init__(self, config)
        self.address = config.get('address', 12)
        self.port = config.get('port', "/dev/ttyACM0")
        self.logger.info(f"Connected to maestro at {self.port}")
        self.Controller = mae.Controller(port=self.port, device=self.address)
        self.Controller.getErrors()
        self.logger = logging.getLogger()

    def getPos(self, angle):
        if angle > 90:
            angle = 90
        if angle < -90:
            angle = -90
        return self.CENTRE + int(self.RANGE * angle / 90)

    @staticmethod
    def calc_speed(speed):  # s/60 deg
        QuarterTickPer60Deg = 2000 / 4
        TenMSPerSecond = 100
        out = int(1 / (speed / QuarterTickPer60Deg * TenMSPerSecond))
        print("Calc Speed: ", out)
        return out

    def create_servo_model(self, channel, config):
        self.logger.info("Creating a servo model, well, just starting that process")
        sm = ServoModel(channel, self.calc_speed(config["speed"]), config["neutral"],
                          self.Controller.getPosition(channel))
        self.logger.info("We have created the servo model object")
        self.Controller.setRange(channel, self.CENTRE-self.RANGE, self.CENTRE+self.RANGE)
        self.Controller.setSpeed(channel, sm.speed)
        self.Controller.setAccel(channel, 0)
        self.logger.info("Finishing creating a servo model")
        return sm

    def go_to(self, channel, pos):
        self.logger.info(f"Trying to moving channel {channel} to position {pos}")
        self.Controller.setTarget(channel, pos)
        x = self.Controller.getPosition(channel)
        while x != pos:
            x = self.Controller.getPosition(channel)
        self.logger.info(f"Finished moving channel {channel} to position {pos}")


    def stop(self):
        pass

    def close(self):
        self.Controller.close()
