#!/usr/bin/env python3

import websockets, asyncio, psutil, json

def getData():
	
	# Get memory data
	memory_total = psutil.virtual_memory().total
	memory_used = psutil.virtual_memory().used
	
	# Get CPU usage
	cpu_percent = psutil.cpu_percent(interval=1)
	
	# Get CPU temp
	highest_temp = 0.0
	highest_core = ''
	for i in psutil.sensors_temperatures()['coretemp']:
		if (i.current > highest_temp):
			highest_temp = i.current
			highest_core = i.label
			
	# Get uptime
	with open('/proc/uptime', 'r') as f:
		uptime = f.readline().split()[0]
	
	message = {}
	message["memory_total"] = str(memory_total)
	message["memory_used"] = str(memory_used)
	message["cpu_percent"] = str(cpu_percent)
	message["highest_temp"] = str(highest_temp)
	message["uptime"] = str(uptime)

	return json.dumps(message)

@asyncio.coroutine
def sendPerformanceData(websocket, path):
	while True:
		yield from websocket.send(getData())
		
start_server = websockets.serve(sendPerformanceData, "10.0.2.4", 5558)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
