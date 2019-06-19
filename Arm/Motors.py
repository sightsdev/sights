import dynamixel_sdk as DXLSDK
from Dxl_Register import Dxl_Register as Register
from enum import Enum
from typing import Dict


class MotorBase(object):
    baud2reg = {
        9600:0,
        57600:1,
        115200:2,
        1000000:3,
        2000000:4,
        3000000:5,
        4000000:6,
        4500000:7
    }
    
    baudfromreg = {
        0:9600,
        1:57600,
        2:115200,
        3:1000000,
        4:2000000,
        5:3000000,
        6:4000000,
        7:4500000
    }
    
    resolution = 1
    
    port = None
    packetHandler  = None
    
     # Control table address
    #EEPROM
    ID_REG = None
    BAUDRATE = None
    MAX_POSITION = None
    MIN_POSITION = None
    
    #RAM
    TORQUE_ENABLE = None
    LED = None
    GOAL_POSITION = None
    PRESENT_LOAD = None
    PRESENT_POSITION = None
    PRESENT_TEMP = None
    
    def commResult(self, result, error):
        if result != DXLSDK.COMM_SUCCESS:
           return 0
        elif error != 0:
            return -1
        else:
            return 1
    
    def Deg2Pos(self, deg):
        return deg/self.resolution+self.PRESENT_POSITION.maxVal

    def Pos2Deg(self, pos):
        return (pos-self.PRESENT_POSITION.maxVal)*self.resolution
    
    def reboot(self):
        dxl_comm_result, dxl_error = self.packetHandler.reboot(self.portHandler, self.ID)
        return self.commResult(dxl_comm_result, dxl_error)
    
    class ProfileConfigurations(Enum):
        WheelMode = 1
        JointMode = 3
        
        @classmethod
        def parse(cls, label):
            if label.lower() in ("joint","jointmode"):
                return cls.JointMode
            if label.lower() in ("wheel","wheelmode"):
                return cls.WheelMode
            raise NotImplementedError

class AX12A(MotorBase):
        
    def __posNormal__(self, pos):
        return pos
    
    def __posReversed__(self, pos):
        if pos is not None:
            pos = self.MAX_POSITION.max-pos
        return pos
    
    def __wheelNormal__(self, speed):
        return speed
    
    def __wheelReversed__(self, speed):
        return speed^(1<<10) if speed is not None else None
    
    pos_speed_mode = None
    resolution = 0.29
    def __init__(self, ID, portHandler, reverse=False, baudrate="57600", driveMode="Joint", minimum=None, maximum=None):
        self.port              = portHandler
        self.packetHandler     = DXLSDK.PacketHandler(1.0)
        self.ID                = ID
        
        # Control table address
        #EEPROM
        self.ID_REG            = Register(self.packetHandler, 3,  1, 252)  #ID 254 is broadcast               
        self.BAUDRATE          = Register(self.packetHandler, 4,  1, 7)
        self.MAX_POSITION      = Register(self.packetHandler, 8,  2, 1023) #
        self.MIN_POSITION      = Register(self.packetHandler, 6,  2, 1023) #
        self.ERROR             = Register(self.packetHandler, 17, 1, 127)
        
        #RAM
        self.TORQUE_ENABLE     = Register(self.packetHandler, 24, 1, 1)
        self.LED               = Register(self.packetHandler, 25, 1, 1)
        self.GOAL_POSITION     = Register(self.packetHandler, 30, 2, 4095)
        self.GOAL_VELOCITY     = Register(self.packetHandler, 32, 2, 2047)
        self.PRESENT_LOAD      = Register(self.packetHandler, 40, 2, 1023, writeable=False)
        self.PRESENT_POSITION  = Register(self.packetHandler, 36, 2, 4095, writeable=False)
        self.PRESENT_TEMP      = Register(self.packetHandler, 43, 1, 99, writeable=False)
        
        
               
        print((self.setDriveMode(self.ProfileConfigurations.parse(driveMode), reverse, minimum, maximum)))
        
        
    def setDriveMode(self, ProfileConfiguration=None, Reversed=None, Min = None, Max = None):
        if ProfileConfiguration is not None:
            self.drive_mode = ProfileConfiguration
            if ProfileConfiguration is self.ProfileConfigurations.WheelMode:
                self.write(self.MIN_POSITION, 0)
                self.write(self.MAX_POSITION, 0)
            else:
                self.write(self.MIN_POSITION, self.MIN_POSITION.min if Min is None else Min)
                self.write(self.MAX_POSITION, self.MAX_POSITION.max if Max is None else Max)
        
        if Reversed is not None:
            self.reversed = Reversed
        
        if self.drive_mode is self.ProfileConfigurations.JointMode:
            self.pos_speed_mode = self.__posReversed__ if self.reversed else self.__posNormal__
        else:
            self.pos_speed_mode = self.__wheelReversed__ if self.reversed else self.__wheelNormal__
            
            
    def printErrors(self):
        errors = self.read(self.ERROR) 
        if errors == 0:
            return
        print(("Error on Dynamixel ID: %d \n" % self.ID))
        if errors is None:
            print("\tUnable to Read Errors")
        if(errors == 0b00100100):
            print("\tDefault Error (Overheat & Overload)")
            return
        if(errors & 1):
            print("\tInput Voltage Error\n")
        if(errors>>1 & 1):
            print("\tAngle Limit Error\n")
        if(errors>>2 & 1):
            print("\tOverHeating Error\n")
        if(errors>>3 & 1):
            print("\tRange Error\n")
        if(errors>>4 & 1):
            print("\tChecksum Error\n")
        if(errors>>5 & 1):
            print("\tOverload Error\n")
        if(errors>>6 & 1):
            print("\tInstruction Error\n")
            
    def status(self):
        return "ID: {}, reversed: {}".format(self.ID, self.reversed)
            
    def hasError(self):
        return self.read(self.ERROR) != 0
    
    def printErrors(self):
       pass
        
    def enable(self):
        return self.write(self.TORQUE_ENABLE, 1) == 1
    
    def disable(self):
        return self.write(self.TORQUE_ENABLE, 0) == 1
    
    def isenabled(self):
        return self.read(self.TORQUE_ENABLE)
    
    def write(self, register, data):
        if self.port.getBaudRate() != self.BAUDRATE:
            self.port.setBaudRate(self.BAUDRATE)
        dxl_comm_result, dxl_error = register.write(int(data), self.ID, self.port)
        return self.commResult(dxl_comm_result, dxl_error)
    
    
    def read(self, register):
        if self.port.getBaudRate() != self.BAUDRATE:
            self.port.setBaudRate(self.BAUDRATE)
        data, comm_result, error = register.read(self.ID, self.port)
        if(comm_result == DXLSDK.COMM_SUCCESS and error==0):
            return data
        else:
            return None
        
    def currentPos(self, convert2Deg=True):
        pos = self.pos_speed_mode(self.read(self.PRESENT_POSITION))
        if pos is None:
            return -99999
        elif convert2Deg:
            return self.Pos2Deg(pos)
        else:
            return pos
        
    def getGoalPos(self, convert2Deg=True):
        if self.drive_mode == self.ProfileConfigurations.WheelMode:
            return -90909
        pos = self.pos_speed_mode(self.read(self.GOAL_POSITION))
        if pos is None:
            return -99999
        elif convert2Deg:
            return self.Pos2Deg(pos)
        else:
            return pos
    
    def setGoalSpeed(self, goal, Normal=True):
        if self.drive_mode is self.ProfileConfigurations.WheelMode:
            if Normal:
                goal=int(int(self.GOAL_VELOCITY.max/2)*goal)
            goal = self.pos_speed_mode(goal)
            print("ID: {}, SPEED: {}".format(self.ID, goal))
            return self.write(self.GOAL_VELOCITY, goal)
        return -1
    
    def setGoalPos(self, goal, Deg=True):
        if self.drive_mode is not self.ProfileConfigurations.WheelMode:
            goal = self.pos_speed_mode(goal)
            if Deg:
                goal=self.Deg2Pos(goal)
            if goal <= self.maxPos and goal >= self.minPos:
                return self.write(self.GOAL_POSITION, goal)
        return -1
    
    def setPosBounds(self, minPos, maxPos, Deg=True):
        minPos = self.pos_speed_mode(minPos)
        maxPos = self.pos_speed_mode(maxPos)
        if Deg:
            minPos = self.Deg2Pos(minPos)
            maxPos = self.Deg2Pos(maxPos)
        count = 0
        if self.write(self.MIN_POSITION, minPos)==1:
            self.minPos = minPos
            count+=1
        if self.write(self.MAX_POSITION, maxPos)==1:
            self.maxPos = maxPos
            count+=1
        return count==2
    
    
    
class MX12W(AX12A):
    resolution = 0.088
    def __init__(self, ID, portHandler, reverse=False, baudrate="57600", driveMode="Joint", minimum=None, maximum=None):
        self.port              = portHandler
        self.packetHandler     = DXLSDK.PacketHandler(1.0)
        self.ID                = ID
        
        # Control table address
        #EEPROM
        self.ID_REG            = Register(self.packetHandler, 3, 1, 252)  #ID 254 is broadcast               
        self.BAUDRATE          = Register(self.packetHandler, 4, 1, 7)
        self.MAX_POSITION      = Register(self.packetHandler, 8, 2, 4095)
        self.MIN_POSITION      = Register(self.packetHandler, 6, 2, 4095)
        
        #RAM
        self.TORQUE_ENABLE     = Register(self.packetHandler, 24, 1, 1)
        self.LED               = Register(self.packetHandler, 25, 1, 1)
        self.GOAL_POSITION     = Register(self.packetHandler, 30, 2, 4095)
        self.GOAL_VELOCITY     = Register(self.packetHandler, 32, 2, 2047)
        self.PRESENT_LOAD      = Register(self.packetHandler, 40, 2, 1023, writeable=False)
        self.PRESENT_POSITION  = Register(self.packetHandler, 36, 2, 4095, writeable=False)
        self.PRESENT_TEMP      = Register(self.packetHandler, 43, 1, 99, writeable=False)
        
        print((self.setDriveMode(self.ProfileConfigurations.parse(driveMode), reverse, minimum, maximum)))
        

class XL430W250(MotorBase):
    resolution = 0.088
    def __init__(self, ID, portHandler, reverse=False, baudrate="57600"):
        self.port              = portHandler
        self.packetHandler     = DXLSDK.PacketHandler(2.0)
        self.ID                = ID
        
        # Control table address
        #EEPROM
        self.ID_REG            = Register(self.packetHandler, 7, 1, 253)  #ID 253 is broadcast               
        self.BAUDRATE          = Register(self.packetHandler, 8, 1, 7)
        self.DRIVE_MODE         = Register(self.packetHandler, 10, 1, 256)
        self.OPERATING_MODE    = Register(self.packetHandler, 11, 1, 16)
        self.MAX_POSITION           = Register(self.packetHandler, 48, 4, 4095)
        self.MIN_POSITION           = Register(self.packetHandler, 52, 4, 4095)
        self.MAX_VELOCITY
        
        #RAM
        self.TORQUE_ENABLE     = Register(self.packetHandler, 64, 1, 1)
        self.LED               = Register(self.packetHandler, 65, 1, 1)
        self.ERROR             = Register(self.packetHandler, 70, 1, 255, writeable=False)
        self.GOAL_POSITION     = Register(self.packetHandler, 116, 4, 4095)
        self.GOAL_VELOCITY     = Register(self.packetHandler, 104, 4, 1023, minVal = -1023)
        self.PRESENT_LOAD      = Register(self.packetHandler, 126, 2, 1000, minVal=-1000, writeable=False)
        self.PRESENT_POSITION  = Register(self.packetHandler, 132, 4, 4095, writeable=False)
        self.PRESENT_TEMP      = Register(self.packetHandler, 146, 1, 256, writeable=False)
        
        
        if reverse is not "init":
            minPos                 = self.read(self.MIN_POSITION)
            maxPos                 = self.read(self.MAX_POSITION)
            self.minPos            = minPos if minPos is not None else 0
            self.maxPos            = maxPos if maxPos is not None else 4095
        
        print((self.setDriveMode(Reversed=reverse)))
        
        
    def setDriveMode(self, ProfileConfiguration=None, Reversed=None, Min = None, Max = None):
        if Reversed is not None:
            self.reversed = Reversed
            self.write(self.DRIVE_MODE, (self.read(self.DRIVE_MODE)&(~1))|reversed)
            
        if ProfileConfiguration is not None:
            self.drive_mode = ProfileConfiguration
            if ProfileConfiguration is self.ProfileConfigurations.JointMode:
                self.write(self.MIN_POSITION, self.MIN_POSITION.min if Min is None else Min)
                self.write(self.MAX_POSITION, self.MAX_POSITION.max if Max is None else Max)
            self.write(self.OPERATING_MODE, self.drive_mode.value)
        
        
            
    def status(self):
        return "ID: %, reversed: %" % (self.read(self.ID), self.read(self.DRIVE_MODE)&1)
            
    def hasError(self):
        return self.read(self.ERROR) != 0
    
    def printErrors(self):
        errors = self.read(self.ERROR) 
        if errors == 0:
            return
        print(("Error on Dynamixel ID: %d \n" % self.ID))
        if errors is None:
            print("\tUnable to Read Errors")
        if(errors == 0b00110100):
            print("\tDefault Error")
            return
        if(errors & 1) != 0:
            print("\tInput Voltage Error\n")
        if(errors>>2 & 1):
            print("\tOverHeating Error\n")
        if(errors>>3 & 1):
            print("\tMotor Encoder Error\n")
        if(errors>>4 & 1):
            print("\tElectrical Shock Error\n")
        if(errors>>5 & 1):
            print("\tOverload Error\n")
        
    def enable(self):
        return self.write(self.TORQUE_ENABLE, 1) == 1
    
    def disable(self):
        return self.write(self.TORQUE_ENABLE, 0) == 1
    
    def isenabled(self):
        return self.read(self.TORQUE_ENABLE)
    
    def write(self, register, data):
        if self.port.getBaudRate() != self.BAUDRATE:
            self.port.setBaudRate(self.BAUDRATE)
        dxl_comm_result, dxl_error = register.write(int(data), self.ID, self.port)
        return self.commResult(dxl_comm_result, dxl_error)
    
    def read(self, register):
        if self.port.getBaudRate() != self.BAUDRATE:
            self.port.setBaudRate(self.BAUDRATE)
        data, comm_result, error = register.read(self.ID, self.port)
        if(comm_result == DXLSDK.COMM_SUCCESS and error==0):
            return data
        else:
            return None
        
    def currentPos(self, convert2Deg=True):
        pos = self.read(self.PRESENT_POSITION)
        if pos is None:
            return -99999
        elif convert2Deg:
            return self.Pos2Deg(pos)
        else:
            return pos
        
    def getGoalPos(self, convert2Deg=True):
        pos = self.read(self.GOAL_POSITION)
        if pos is None:
            return -99999
        elif convert2Deg:
            return self.Pos2Deg(pos)
        else:
            return pos
    
    def setGoalPos(self, goal, Deg=True):
        if Deg:
            goal=self.Deg2Pos(goal)
        if goal <= self.maxPos and goal >= self.minPos:
            return self.write(self.GOAL_POSITION, goal)
        return -1
    
    def setGoalSpeed(self, goal, Normal=True):
        if Normal:
            goal=self.GOAL_VELOCITY.max*goal
        return self.write(self.GOAL_VELOCITY, goal)
    
    def setPosBounds(self, minPos, maxPos, Deg=True):
        if Deg:
            minPos = self.Deg2Pos(minPos)
            maxPos = self.Deg2Pos(maxPos)
        count = 0
        if self.write(self.MIN_POSITION, minPos)==1:
            self.minPos = minPos
            count+=1
        if self.write(self.MAX_POSITION, maxPos)==1:
            self.maxPos = maxPos
            count+=1
        return count==2




class MotorGroup():
    def __init__(self, motors:Dict[str, MotorBase]):
        self.motors = motors
    
    def __getitem__(self, key):
        return self.motors[key]
    
    def __setitem__(self, key, value):
        self.addMotor(key, value)
    
    def addMotor(self, key, value):
        if key in self.motors.keys():
            res = False
        else:
            self.motors[key] = value
            res = True
        print("{} {} set to {}: {}".format(key, "was" if res else "wasn't", value, self.motors[key]))
    
    def setDriveMode(self, ProfileConfiguration=None, Reversed=None):
        for m in self.motors.values():
            m.setDriveMode(ProfileConfiguration=ProfileConfiguration, Reversed=Reversed)
        
    def hasError(self):
        return any(list([motor.hasError() for motor in self.motors.values()]))
    
    def printErrors(self):
        for m in self.motors.values():
            m.printErrors()
        
    def enable(self):
        return list([motor.enable() for motor in self.motors.values()])
    
    def disable(self):
        return list([motor.disable() for motor in self.motors.values()])
    
    def isenabled(self):
        return list([motor.isenabled() for motor in self.motors.values()])
    
    def write(self, register, data):
        return list([motor.write(register, data) for motor in self.motors.values()])
    
    def read(self, register):
        return list([motor.read(register) for motor in self.motors.values()])
    
    def currentPos(self, convert2Deg=True):
        return list([motor.currentPos(convert2Deg=convert2Deg) for motor in self.motors.values()])
        
    def getGoalPos(self, convert2Deg=True):
        return list([motor.getGoalPos(convert2Deg=convert2Deg) for motor in self.motors.values()])
    
    def setGoalPos(self, goal, Deg=True):
        return list([motor.setGoalPos(goal, Deg=Deg) for motor in self.motors.values()])
    
    def setPosBounds(self, minPos, maxPos, Deg=True):
        return list([motor.setPosBounds(minPos, maxPos, Deg=Deg) for motor in self.motors.values()])
    
    def setGoalSpeed(self, goal, Normal=True):
        return list([motor.setGoalSpeed(goal, Normal) for motor in self.motors.values()])
