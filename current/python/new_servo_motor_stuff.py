from socket import *
from pyax12.connection import Connection
import time

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)
#speedSetting = 4
id = 1

sc.write_data(1,8,bytes([0,0]))
sc.write_data(2,8,bytes([0,0]))

# Set low and high bit of moving speed (high bit seems to change speed and direction) 
sc.write_data(1,32,bytes([0,0]))
sc.write_data(2,32,bytes([0,0]))

#turning speed into a byte array, remember you need 2 bytes!!!
def speedSettingToByteArray(reverse, arc, speedSetting):
	#global speedSetting 		#global speed variable, pretty useful
	a = speedSetting * 256 - 1; #turn speed into byte acceptable format
	if reverse: 				#check if the speed needs to be reversed
		a = a + 1024			#if so, just make the current speed + 1024 (cos thats how reversing works)
	if arc:						#check if needs to arc
		a = a / 2				#just divide speed by 2
	return bytearray(a.to_bytes(2, 'little')) #turn it into a byte array, acceptable for the motors

def runMotor(m_id, speed): #runs a motor (or stops it)
	print (m_id)		   #debug
	sc.write_data(m_id,32,speed)	#send ID, ADDRESS and SPEED

def runMotorGroup(m_ids, spd):	#Run motors in groups (aka more than 1)
	for m_id in m_ids:			#loop through the given ID arrays
		print(m_id)				#debug
		runMotor(m_id, spd)		#run motor function

def bckFwdRun(key):								#Motor function for going backwards and forwards
	fwd = speedSettingToByteArray(False, False)	#fwd var gets the speed into bytes; reverse: FALSE; arc: FALSE 
	bwd = speedSettingToByteArray(True, False)	#bwd var gets the speed into bytes; reverse: TRUE; arc: FALSE
	if (key == 1):								#if key for forward is given -- go forward --
		runMotorGroup([1,3], fwd)				#run the 1st and 3rd motors foward 
		runMotorGroup([2,4], bwd)				#run the 2nd and 4th motors backward 
		return None								#break out of function cos its all done
	elif (key == 2):							#check if the key is 2 -- go backwards --
		runMotorGroup([1,3], bwd)				#run the 1st and 3rd motors backward
		runMotorGroup([2,4], fwd)				#run the 2nd and 4th motors forward
		return None								#break out of function
	print("forward/backwards??? got a weird key: " + str(key)) #if it got here well... error time

def leftRightRun(key):								#Function for going left and right on the spot
	fwd = speedSettingToByteArray(False, False)		#var speed to bytes reverse: FALSE; arc: FALSE
	bwd = speedSettingToByteArray(True, False)		#var speed to bytes reverse: TRUE; arc: FALSE
	if (key == 3):									#--- turn left ---
		runMotorGroup([1,3], bytes([0,0]))#run motors on left side back and right side forward
		runMotor(2, fwd)
		runMotor(4, bwd)#run motors on right side forward and left side backward
		return None	
	elif (key == 4):								#--- turn right ---
		runMotorGroup([2,4], bytes([0,0]))			#run motors on left side back and right side forward
		runMotor(1, fwd)
		runMotor(3, bwd)				#run right side back
	print("Left and Right??? got a weird key: " + str(key)) #error if neither keys 3 or 4 are given

def arcLeftRight(key):							#make robot arc right or left (maybe reverse???????)
	fwd = speedSettingToByteArray(False, True)	#var speed to bytes reverse: FALSE; arc: TRUE
	bwd = speedSettingToByteArray(True, True)	#var speed to bytes reverse: TRUE; arc: TRUE
	if (key == 5):								#--- arc left ---
		runMotor(1, fwd)
		runMotor(2, speedSettingToByteArray(False, False))
		runMotor(3, bwd)
		runMotor(4, speedSettingToByteArray(True, False))
		return None
	elif (key == 6):
		runMotor(3, fwd)
		runMotor(4, speedSettingToByteArray(False, False))
		runMotor(1, bwd)
		runMotor(2, speedSettingToByteArray(True, False))
		return None
	print ("ARC ERROR OMG!!! KEY THAT WASNT 6 or 7 GIVEN!! KEY: " + str(key))

arcLeftRight(5)
time.sleep(8)
runMotorGroup([1,2,3,4], bytes([0,0])                                                )
