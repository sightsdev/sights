import websockets, asyncio, psutil

#print(psutil.sensors_temperatures()) #
#print(psutil.cpu_percent(interval=None)) #returns float
#print(str(psutil.virtual_memory()))

words = str(psutil.virtual_memory()).split()
temperatures = str(psutil.sensors_temperatures()).split()

print(temperatures)

#print(words)

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

def dataArrayToString(prop, words_index):
	number_string = ""
	number = getNumber(words[words_index], prop)
	for num in number:
		number_string = number_string + num
	return number_string[:-1]

def getVirtualMemoryData():
	memory_data = []
	memory_data.append(dataArrayToString("total=", 0))
	memory_data.append(dataArrayToString("used=", 3))
	return memory_data

print(getVirtualMemoryData())
print("CPU Percent: {}".format(psutil.cpu_percent(interval=1)))



		




					
				


#@asyncio.coroutine
#def sendNUKData(websocket, path):
#	while True:
	
			
			
		
		
#start_server = websockets.serve(sendSensorData, "10.0.2.5", 5557)
#asyncio.get_event_loop().run_until_complete(start_server)
#asyncio.get_event_loop().run_forever()
	


