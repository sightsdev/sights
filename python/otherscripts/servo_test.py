from pyax12.connection import Connection

# Connect to the serial port
serial_connection = Connection(port="/dev/ttyACM0", baudrate=1000000)

# Ping the dynamixel unit(s)
ids_available = serial_connection.scan()

for dynamixel_id in ids_available:
    print(dynamixel_id)

# Close the serial connection
serial_connection.close()
