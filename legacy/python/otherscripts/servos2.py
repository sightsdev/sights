from pyax12.connection import Connection

# Connect to the serial port
# serial_connection = Connection(port="/dev/ttyUSB0", baudrate=57600)

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)

ids = sc.scan()

for id in ids:
	print(id)
	
sc.close()

input()
