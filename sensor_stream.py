#!/usr/bin/env python3

import websockets
import asyncio
import psutil
import json
import serial
import configparser
from datetime import timedelta

config = configparser.ConfigParser()
config.read('robot.cfg')

# Check if Arduino is enabled in config file
arduino_enabled = config['arduino'].getboolean('enabled')

if (arduino_enabled):
    try:
        # Attempt to open serial com with Arduino
        ser = serial.Serial(port=config['arduino']['port'],
                            baudrate=int(config['arduino']['baudrate']))
    except serial.serialutil.SerialException:
        print("SERVER: Error: Could not open Arduino serial port. Is the correct port configured 'robot.cfg'?")
        print("SERVER: Continuing without Arduino connection\n")
        arduino_enabled = False


def getData():
    # Create empty message
    msg = {}

    # Get highest CPU temp from system
    highest_temp = 0.0
    temp_data = psutil.sensors_temperatures()
    if len(temp_data) != 0:
        for i in temp_data['coretemp']:
            if (i.current > highest_temp):
                highest_temp = i.current
    # Add to message
    msg["cpu_temp"] = str(highest_temp)

    # Get RAM in use and total RAM
    memory = psutil.virtual_memory()
    # Add to message, use bit shift operator to represent in MB
    msg["memory_used"] = str(memory.used >> 20)
    msg["memory_total"] = str(memory.total >> 20)

    # System uptime
    with open('/proc/uptime', 'r') as f:
        uptime_seconds = round(float(f.readline().split()[0]))
        msg["uptime"] = str(timedelta(seconds=uptime_seconds))

    # Get data from Arduino
    if arduino_enabled:
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
        # Thermal Camera
        elif (buf[0] == "C"):
            # Strip and add to message
            msg["thermal_camera"] = buf[2:-3].split(",")
    # Return message to be sent to control panel
    return json.dumps(msg)


async def sendSensorData(websocket, path):
    print("SERVER: Client connected")
    while True:
        try:
            await websocket.send(getData())
        except websockets.exceptions.ConnectionClosed:
            print("SERVER: Client disconnected")
            break


def main():
    print("SERVER: Starting sensor data server")
    start_server = websockets.serve(
        sendSensorData, config['network']['ip'], 5556)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()
