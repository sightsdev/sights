#!/usr/bin/env python3
import websockets, asyncio, psutil, json, serial

ser = serial.Serial("/dev/ttyACM1", 115200)
msg = {}

def getData():
    # Get data from system
    
    # Get memory data
	#memory_total = psutil.virtual_memory().total
	#memory_used = psutil.virtual_memory().used
	# Get CPU usage
	#cpu_percent = psutil.cpu_percent(interval=1)
	# Get CPU temp
	highest_temp = 0.0
	highest_core = ''
	for i in psutil.sensors_temperatures()['coretemp']:
		if (i.current > highest_temp):
			highest_temp = i.current
			highest_core = i.label
	# Get uptime
	#with open('/proc/uptime', 'r') as f:
	#	uptime = f.readline().split()[0]
	
	#msg["memory_total"] = str(memory_total)
	#msg["memory_used"] = str(memory_used)
	#msg["cpu_percent"] = str(cpu_percent)
	msg["highest_temp"] = str(highest_temp)
	#msg["uptime"] = str(uptime)
	
    # Get data from Arduino
	buf = ser.readline().decode("UTF-8")
	# If string begins with "D:", it's distance
	if (buf[0] == "D"):
		# Strip leading "D:" and split by comma
		msg["dist"] = buf[2:-3].split(",")
	print (json.dumps(msg))
	return json.dumps(msg)

async def sendSensorData(websocket, path):
	while True:
		await websocket.send(getData())

def main():
	print("Starting sensor data server")
	start_server = websockets.serve(sendSensorData, "10.0.2.4", 5556)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
	main()
