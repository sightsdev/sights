#!/usr/bin/env python3

from pyax12.connection import Connection
import time
import websockets
import asyncio
import subprocess, os

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
		runMotorGroup([1,3], bwd)				#run the 1st and 3rd motors foward 
		runMotorGroup([2,4], fwd)				#run the 2nd and 4th motors backward 
		return None								#break out of function cos its all done
	elif (key == 2):							#check if the key is 2 -- go backwards --
		runMotorGroup([1,3], fwd)				#run the 1st and 3rd motors backward
		runMotorGroup([2,4], bwd)				#run the 2nd and 4th motors forward
		return None								#break out of function
	print("forward/backwards??? got a weird key: " + str(key)) #if it got here well... error time

def leftRightRun(key, s):								#Function for going left and right on the spot
	fwd = speedSettingToByteArray(False, False, s)		#var speed to bytes reverse: FALSE; arc: FALSE
	bwd = speedSettingToByteArray(True, False, s)		#var speed to bytes reverse: TRUE; arc: FALSE
	if (key == 3):									#--- turn left ---
		runMotorGroup([1,2,3,4], bwd)							#run motors on right side forward and left side backward
		return None	
	elif (key == 4):								#--- turn right ---
		runMotorGroup([1,2,3,4], fwd)					#run right side back
	print("Left and Right??? got a weird key: " + str(key)) #error if neither keys 3 or 4 are given

def flipWhenVert(key, s):
	back = speedSettingToByteArray(True, False, s)
	forw = speedSettingToByteArray(False, False, s)
	if (key == 6):
		runMotor(1, back)
		runMotor(2, forw)
		return None
	elif(key == 5):
		runMotor(3, back)
		runMotor(4, forw)
		return None
	if (key == 7):
		runMotor(3, forw)
		runMotor(4, back)
		return None
	elif(key == 8):
		runMotor(1, forw)
		runMotor(2, back)
		return None
		
def dropTheBKey(key, s):
	if (key == 9):
		leftRightRun(3, s)
		time.sleep(5)
		leftRightRun(4, s)
		time.sleep(5)
		flipWhenVert(6, s)
		
		

def getSpeed(buf):#  xy x = KEY y = SPEED
	#print( "<2:<{}".format(str(buf)[2:]))
	print("Key: {}".format(str(buf)[2:]))
	return int(str(buf)[2:])

def getKey(buf):#  xy x = KEY y = SPEED
	#print ("<0<{}".format(str(buf)[0]))
	print("Speed: {}".format(str(buf)[0]))
	return int(str(buf)[0])

def scanForRobot():
	online_ips = []
	for i in range(1, 6):
		response = subprocess.Popen(['ping', '-c', '1', '-W', '2', '10.0.2.%s' % i], stdout=subprocess.PIPE)
		response.wait()
		if not response.poll():
			online_ips.append("10.0.2.{}".format(i))	
	os.system("clear")
	print (str(len(online_ips)) + " online device(s)!")
	i = 0
	for j in online_ips:
		print(j)
		if j == "10.0.2.4":
			return j
		elif j == "10.0.2.3":
			return j
		i = i + 1
					
@asyncio.coroutine
def run(websocket, path):
	while True:
		buf = yield from websocket.recv()
		print("buf: {}".format(buf))
		if len(buf) > 0:
			if (getKey(buf) == 1 or getKey(buf) == 2):
				#print ("ITS ALIVE!")
				bckFwdRun(getKey(buf), getSpeed(buf))
				print("Forward/Backward")
			elif (getKey(buf) == 3 or getKey(buf) == 4):
				leftRightRun(getKey(buf), getSpeed(buf))
				print("Left/Right")
			elif (getKey(buf) == 5 or getKey(buf) == 6 or getKey(buf) == 7 or getKey(buf) == 8):
				flipWhenVert(getKey(buf), getSpeed(buf))
				print("Flipping vertically")
			elif (getKey(buf) == 9):
				dropTheBKey(getKey(buf), getSpeed(buf))
			elif(getKey(buf) == 0):
				runMotorGroup([1,2,3,4], bytes([0,0]))
		else:
			runMotorGroup([1,2,3,4], bytes([0,0]))
	
			

start_server = websockets.serve(run, "10.0.2.3", 5555)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
