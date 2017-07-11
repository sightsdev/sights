from pyax12.connection import Connection

# Connect to the serial port
# serial_connection = Connection(port="/dev/ttyUSB0", baudrate=57600)

serial_connection = Connection(port="/dev/ttyACM0", baudrate=1000000)


dynamixel_id = 1

# Ping the third dynamixel unit
is_available = serial_connection.ping(dynamixel_id)

#print(is_available)

# Close the serial connection
serial_connection.close()
