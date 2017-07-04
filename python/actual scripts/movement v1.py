from pyax12.connection import Connection
import time
import websockets
import asyncio

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)
			
def speedSettingToByteArray(reverse, arc, speed):
	#global speedSetting 		#global speed variable, pretty useful
	a = (1023 * (speed * 10)) / 100; #turn speed into byte acceptable format
	if reverse: 				#check if the speed needs to be reversed
		a = a + 1024			#if so, just make the current speed + 1024 (cos thats how reversing works)
	if arc:						#check if needs to arc
		a = a / 2				#just divide speed by 2
	return bytearray(int(a).to_bytes(2, 'little')) #turn it into a byte array, acceptable for the motors

def runMotor(m_id, speed): #runs a motor (or stops it)		   #debug
	sc.write_data(m_id,32,speed)	#send ID, ADDRESS and SPEED

def runMotorGroup(m_ids, spd):	#Run motors in groups (aka more than 1)
	for m_id in m_ids:			#loop through the given ID arrays			#debug
		runMotor(m_id, spd)		#run motor function

def bckFwdRun(key, s):								#Motor function for going backwards and forwards
	fwd = speedSettingToByteArray(False, False, s)	#fwd var gets the speed into bytes; reverse: FALSE; arc: FALSE 
	bwd = speedSettingToByteArray(True, False, s)	#bwd var gets the speed into bytes; reverse: TRUE; arc: FALSE
	if (key == 1):								#if key for forward is given -- go forward --
		runMotorGroup([1,3], fwd)				#run the 1st and 3rd motors foward 
		runMotorGroup([2,4], bwd)				#run the 2nd and 4th motors backward 
		return None								#break out of function cos its all done
	elif (key == 2):							#check if the key is 2 -- go backwards --
		runMotorGroup([1,3], bwd)				#run the 1st and 3rd motors backward
		runMotorGroup([2,4], fwd)				#run the 2nd and 4th motors forward
		return None								#break out of function
	print("forward/backwards??? got a weird key: " + str(key)) #if it got here well... error time

def leftRightRun(key, s):								#Function for going left and right on the spot
	fwd = speedSettingToByteArray(False, False, s)		#var speed to bytes reverse: FALSE; arc: FALSE
	bwd = speedSettingToByteArray(True, False, s)		#var speed to bytes reverse: TRUE; arc: FALSE
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

def arcLeftRight(key, s):							#make robot arc right or left (maybe reverse???????)
	fwd = speedSettingToByteArray(False, True, s)	#var speed to bytes reverse: FALSE; arc: TRUE
	bwd = speedSettingToByteArray(True, True, s)	#var speed to bytes reverse: TRUE; arc: TRUE
	if (key == 5):								#--- arc left ---
		runMotor(1, fwd)
		runMotor(2, speedSettingToByteArray(False, False,s))
		runMotor(3, bwd)
		runMotor(4, speedSettingToByteArray(True, False,s))
		return None
	elif (key == 6):
		runMotor(3, fwd)
		runMotor(4, speedSettingToByteArray(False, False,s))
		runMotor(1, bwd)
		runMotor(2, speedSettingToByteArray(True, False,s))
		return None
	print ("ARC ERROR OMG!!! KEY THAT WASNT 6 or 7 GIVEN!! KEY: " + str(key))

def getSpeed(buf):#  xy x = KEY y = SPEED
	print( "<2:<{}".format(str(buf)[2:]))
	return int(str(buf)[2:])

def getKey(buf):#  xy x = KEY y = SPEED
	print ("<0<{}".format(str(buf)[0]))
	return int(str(buf)[0])
				
@asyncio.coroutine
def run(websocket, path):
	while True:
		buf = yield from websocket.recv()
		print("< {}".format(buf))
		if len(buf) > 0:
			#print(len(str(buf)))
			print(str(buf))
			#print("b1234"[2])
			if (getKey(buf) == 1 or getKey(buf) == 2):
				#print ("ITS ALIVE!")
				bckFwdRun(getKey(buf), getSpeed(buf))
				print("Forward/Backward")
			elif (getKey(buf) == 3 or getKey(buf) == 4):
				print ("33333")
				leftRightRun(getKey(buf), getSpeed(buf))
				print("Left/Right")
			elif (getKey(buf) == 5 or getKey(buf) == 6):
				arcLeftRight(getKey(buf), getSpeed(buf))
				print("ArcLeft/ArcRight")
			elif(int(buf) == 0):
				runMotorGroup([1,2,3,4], bytes([0,0]))
				print("Stop")
		else:
			#runMotorGroup([1,2,3,4], bytes([0,0]))
			print("not")

start_server = websockets.serve(run, "10.0.2.4", 5555)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
