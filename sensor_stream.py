#!/usr/bin/env python3
import websockets, asyncio, psutil, json
import serial, json

ser = serial.Serial("/dev/ttyACM1", 115200)
msg = {}

def getData():
	buf = ser.readline().decode("UTF-8")
	# If string begins with "D:", it's distance
	if (buf[0] == "D"):
		# Strip leading "D:" and split by comma
		msg["dist"] = buf[2:-3].split(",")
	return json.dumps(msg)

async def sendSensorData(websocket, path):
	while True:
		await websocket.send(getData())

def main():
	print("Starting sensor data server")
	start_server = websockets.serve(sendSensorData, "10.0.2.4", 5557)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()
