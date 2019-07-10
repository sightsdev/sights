''' Clears overheating errors and reenables motors '''

from pyax12.connection import Connection
sc = Connection("/dev/ttyUSB0", 1000000)
sc.write_data(4, 0x18, 0)
sc.write_data(3, 0x18, 0)
sc.write_data(4, 0x0E, [0xFF, 0x03])
sc.write_data(3, 0x0E, [0xFF, 0x03])
sc.write_data(4, 0x22, [0xFF, 0x03])
sc.write_data(3, 0x22, [0xFF, 0x03])
