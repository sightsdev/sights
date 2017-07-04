from socket import *
import time


#SART netowrk pass SFXCRoboCup2017!

 #  Create and open the socket will be listening on
server_socket = socket(AF_INET, SOCK_STREAM)
server_socket.bind(("10.0.2.7", 5555))
server_socket.listen(1)


while(True):
	# Inside processing loop we wait for a connection
	client_socket, address = server_socket.accept()
	print("Client connected!")
	buf = client_socket.recv(64)
	if len(buf) > 0:
		print(buf)
		print("msg received")
	else:
		print("no msg received!")
	
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
#input()
