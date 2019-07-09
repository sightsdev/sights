#!/usr/bin/env python3

import websockets
import asyncio
import psutil
import json
import serial
import configparser
from smbus2 import SMBusWrapper
from RPI_SGP30 import sgp30
from MLX90614.mlx90614 import MLX90614
from datetime import timedelta

config = configparser.ConfigParser()
config.read('robot.cfg')

msg = {}

def getData(sgp, temp):
	msg["co2"] = sgp.read_measurements()[0][0]
	msg["tvoc"] = sgp.read_measurements()[0][1]
	msg["temp"] = [round(temp.get_obj_temp(), 1)]
	msg["cpu_temp"] = str(psutil.sensors_temperatures()['thermal-fan-est'][0].current)
	# Get RAM in use and total RAM
	memory = psutil.virtual_memory()
	# Add to message, use bit shift operator to represent in MB
	msg["memory_used"] = str(memory.used >> 20)
	msg["memory_total"] = str(memory.total >> 20)

	# System uptime
	with open('/proc/uptime', 'r') as f:
		uptime_seconds = round (float(f.readline().split()[0]))
		msg["uptime"] = str(timedelta(seconds = uptime_seconds))
	# Return message to be sent to control panel
	return json.dumps(msg)


async def sendSensorData(websocket, path):
	print ("Client connected")
	with SMBusWrapper(1) as bus:
		sgp = sgp30.SGP30(bus)
		sgp.init_sgp()
		temp = MLX90614(0x5A)
		while True:
			try: 
				await websocket.send(getData(sgp, temp))
			except websockets.exceptions.ConnectionClosed:
				print ("Client disconnected")
				break


def main():
	print("Starting sensor data server")
	start_server = websockets.serve(
		sendSensorData, config['network']['ip'], 5556)
	asyncio.get_event_loop().run_until_complete(start_server)
	asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
	main()
