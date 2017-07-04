from pyax12.connection import Connection
import time

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)
id = 1
sc.pretty_print_control_table(id)

#ids = sc.scan()

#for dynamixel_id in ids:
#    print(dynamixel_id)
#time.sleep(5)
#sc.goto(id, -45, speed=512, degrees=True)
#time.sleep(5)


#sc.write_data(1,8,bytes([-150,150]))

#sc.write_data(1,24,0x01)

#print(sc.read_data(1,3,1))
#sc.write_data(1,3,0x01)


#print(sc.read_data(1,32,2))

#for high in 0,1,2,3:
#	print("speed: " + str(high))
#	key = bytes([255,high]) 
#	sc.write_data(1,32,key)
#	time.sleep(2)


#sc.write_data(1,32,bytes([255,1]))

#print(sc.read_data(1,32,2))

#sc.pretty_print_control_table(id)
#time.sleep(5)

sc.close()
