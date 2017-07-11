from socket import *
from pyax12.connection import Connection
import time


#SART netowrk pass SFXCRoboCup2017!
sc = Connection(port="/dev/ttyACM0", baudrate=1000000)
speedSetting = 4
id = 1

sc.write_data(1,8,bytes([0,0]))
sc.write_data(2,8,bytes([0,0]))

# Set low and high bit of moving speed (high bit seems to change speed and direction) 
sc.write_data(1,32,bytes([0,0]))
sc.write_data(2,32,bytes([0,0]))


def speedSettingToByteArray(reverse):
	global speedSetting
	a = speedSetting * 256 - 1;
	if reverse:
		a = a + 1024
	return bytearray(a.to_bytes(2, 'little'))

def runFwd(on):
	if(on == True):
		b = speedSettingToByteArray(False)
		sc.write_data(1,32,b)
		sc.write_data(2,32,b)
	else:
		sc.write_data(1,32,bytes([0,0]))
		sc.write_data(2,32,bytes([0,0]))
		

	

 #  Create and open the socket will be listening on
server_socket = socket(AF_INET, SOCK_STREAM)
server_socket.bind(("10.0.2.5", 5555))
server_socket.listen(5)


while(True):
	# Inside processing loop we wait for a connection
	client_socket, address = server_socket.accept()
	print("Client connected!")
	while 1:
		
		buf = client_socket.recv(64)
		if len(buf) > 0:
			
			s = str(buf)
			print(s)
			
			print(buf[0])
			print(buf[1])
			
			
			'''
			msg = list(s)
			#print(msg)
			print(msg[2])
			print(msg[3])
			'''
			if(buf[0] == 1 and buf[1] == 4):
				runFwd(True)
			else:
				runFwd(False)
			#print("msg received")
			
		#else:
		#	print("no msg received!")
	
	#ct = client_thread(client_socket)
	#ct.run()
	
	'''
	# First get the size of the package we will be getting...
	packageLength = client_socket.recv(1)
	if len(packageLength) == 0:
		print("Length is 0")
		#break
	packageLength = ord(packageLength)

	# ... then get the package itself
	controlCommand = client_socket.recv(packageLength)
	if controlCommand == "Terminate":
		print("Terminated")
		#break

	# Respond to the client with current telemetry and status
	client_socket.send(chr(len(sendTelemetry)))
	client_socket.send(sendTelemetry)
	'''


client_socket.close()
print("Connection closed")
time.sleep(10)
input()
