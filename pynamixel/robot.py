"""
Created on Tue May 21 21:37:46 2019

@author: sart
"""
from dynamixel_sdk import PortHandler
from .motors import MotorGroup
import atexit
    
    
        

class RobotBase():
    def __init__(self, motors, port = "/dev/ttyUSB0", baudRate = 57600):
        self.portHandler = PortHandler(port)
        self.connect(baudRate)
        self.motors = MotorGroup(motors)
        atexit.register(self.close)
        
    def countConnected(self):
        flat = self.flatten(self.motors.isenabled())
        total = len(flat)
        connected = total-flat.count(None)
        return(connected, total)
    
    def rebootDisconnected(self):
        self.motors.rebootDisconnected()
            
    def flatten(self, l, ltypes=(list, tuple)):
        ltype = type(l)
        l = list(l)
        i = 0
        while i < len(l):
            while isinstance(l[i], ltypes):
                if not l[i]:
                    l.pop(i)
                    i -= 1
                    break
                else:
                    l[i:i + 1] = l[i]
            i += 1
        return ltype(l)
            
    
    def connect(self, baudRate = None):
        if not self.portHandler.is_open:
            if self.portHandler.openPort():
                print("Succeeded to open the port")
            else:
                print("Failed to open the port")
                return False
            # Set port baudrate
            if self.portHandler.setBaudRate(self.baudRate if baudRate is None else baudRate):
                print("Succeeded to change the baudrate")
            else:
                print("Failed to change the baudrate")
                return False
        return True
 
    def enable(self):
        self.motors.enable()

    def disable(self):
        self.motors.disable()

   
    def waitUntilConnected(self):
        print("connecting to motors")
        ready = False
        while ready is False:
            ready = self.connect()
    
    def close(self):
        self.disable()
        self.portHandler.closePort()
        print("All closed")
