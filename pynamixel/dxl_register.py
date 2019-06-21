"""
Created on Tue May 21 00:02:41 2019

@author: sart
"""
import dynamixel_sdk

class Register():
    def __init__(self, packetHandler, address, length,  maxVal, minVal = 0, writeable=True):
        self.ADDR = address
        self.writeable = writeable
        self.min = minVal
        self.max = maxVal
        
        if length==1:
            self.readFunc = packetHandler.read1ByteTxRx
            self.writeFunc = packetHandler.write1ByteTxRx
        elif length==2:
            self.readFunc = packetHandler.read2ByteTxRx
            self.writeFunc = packetHandler.write2ByteTxRx
        elif length==4:
            self.readFunc = packetHandler.read4ByteTxRx
            self.writeFunc = packetHandler.write4ByteTxRx
        else:
            raise Exception("Invalid register length. Must be one of 1, 2, or 4")
    
    
    
    def read(self, ID, port):
        return self.readFunc(port, ID, self.ADDR)
    
    def write(self, data, ID, port):
        if self.writeable:
            if not data < self.min and not data > self.max:
                return self.writeFunc(port, ID, self.ADDR, data)
            return (dynamixel_sdk.COMM_SUCCESS, 4)
        return (dynamixel_sdk.COMM_NOT_AVAILABLE, 0)
