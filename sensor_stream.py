#!/usr/bin/env python3

##
# TODO: Add thermal camera code
#

import websockets
import asyncio
import psutil
import json
import serial
import configparser

config = configparser.ConfigParser()
config.read('robot.cfg')

ser = serial.Serial(config['arduino']['port'], 115200)
msg = {}


def getData():
    # Get highest CPU temp from system
    highest_temp = 0.0
    highest_core = ''
    for i in psutil.sensors_temperatures()['coretemp']:
        if (i.current > highest_temp):
            highest_temp = i.current
            highest_core = i.label
    # Add to message
    msg["cpu_temp"] = str(highest_temp)

# Get data from Arduino
    buf = ser.readline().decode("UTF-8")
    # If string begins with "D:", it's distance
    if (buf[0] == "D"):
        # Strip leading "D:" and split by comma, removing newline characters. Add to message
        msg["distance"] = buf[2:-3].split(",")
    # Temperature
    elif (buf[0] == "T"):
        # Strip and add to message
        msg["temp"] = buf[2:-3].split(",")
    # Gas (TVOC / CO2)
    elif (buf[0] == "G"):
        # Strip and add to message
        data = buf[2:-3].split(",")
        msg["co2"] = data[0]
        msg["tvoc"] = data[1]
    # Return message to be sent to control panel
    return json.dumps(msg)


async def sendSensorData(websocket, path):
    while True:
        await websocket.send(getData())


def main():
    print("Starting sensor data server")
    start_server = websockets.serve(
        sendSensorData, config['network']['ip'], 5556)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()
