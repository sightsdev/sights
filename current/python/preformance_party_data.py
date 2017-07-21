import websockets, asyncio, psutil

words = str(psutil.virtual_memory()).split()
temperatures = str(psutil.sensors_temperatures()).split()
uptime = float(1)

def getNumber(line, prop):
	numbers = []
	count = 0
	found_equal = False
	if prop in line:
		for character in line:
			if found_equal == True:
				numbers.append(line[count])
			if character == '=':
				found_equal = True
			count = count + 1
		return numbers

def dataArrayToString(prop, words_index, array):
	number_string = ""
	number = getNumber(array[words_index], prop)
	for num in number:
		number_string = number_string + num
	return number_string[:-1]

def getVirtualMemoryData():
	memory_data = []
	memory_data.append(dataArrayToString("total=", 0, words))
	memory_data.append(dataArrayToString("used=", 3, words))
	return memory_data

def getCPUCoreTemp():
	core_data = []
	core_data.append(dataArrayToString("current=", 8, temperatures))
	core_data.append(dataArrayToString("current=", 13, temperatures))
	return str((float(core_data[0]) + float(core_data[1])) / 2)
	

#print(getVirtualMemoryData())
#print("CPU Temp Average: {}".format(getCPUCoreTemp()))

def getUptime():
	with open('/proc/uptime', 'r') as f:
		uptime = float(f.readline().split()[0])
	return str(uptime)

def putInString():
	string_array = []
	string_message = ""
	for mem in getVirtualMemoryData():
		string_array.append(str(mem))
	string_array.append(str(psutil.cpu_percent(interval=1)))
	string_array.append(getCPUCoreTemp())
	string_array.append(getUptime())
	for data in string_array:
		print (data)
		string_message = string_message + data + " " 
	return string_message

#print(putInString())

@asyncio.coroutine
def sendNUCData(websocket, path):
	while True:
		yield from websockets.send(putInString())
		yield from asyncio.sleep(1)
		
start_server = websockets.serve(sendNUCData, "10.0.2.5", 5558)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
