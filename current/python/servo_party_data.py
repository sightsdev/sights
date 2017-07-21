#!/usr/bin/env python3

from pyax12.connection import Connection
import websockets, asyncio, serial
import _thread

serial_connection = Connection(port="COM8", baudrate=1000000)

dynamixel_ids = [1,2,3,4]
		
@asyncio.coroutine
def sendServoData(websocket, path):
	while True:
		for d_id in dynamixel_ids:
			yield from websocket.send("{}*C".format(serial_connection.get_present_temperature(d_id)))
			#print("{}*C".format(serial_connection.get_present_temperature(d_id)))
			yield from websocket.send("{}V".format(serial_connection.get_present_voltage(d_id)))
			#print("{}V".format(serial_connection.get_present_voltage(d_id)))

start_server = websockets.serve(sendServoData, "10.0.2.5", 5556)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

	

