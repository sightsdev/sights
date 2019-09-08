#!/usr/bin/env python3

import websockets
import asyncio
import psutil
import json
import serial
from datetime import timedelta

# Load config file
config = json.load(open('robot.json'))

# Check if Arduino is enabled in config file
arduino_enabled = config['arduino']['enabled']

if (arduino_enabled):
    try:
        # Attempt to open serial com with Arduino
        ser = serial.Serial(port=config['arduino']['port'],
                            baudrate=config['arduino']['baudrate'])
    except serial.serialutil.SerialException:
        print("SERVER: Error: Could not open Arduino serial port. Is the correct port configured 'robot.cfg'?")
        print("SERVER: Continuing without Arduino connection\n")
        arduino_enabled = False


def get_data():
    # Create empty message
    msg = {}

    # Get highest CPU temp from system
    temp_data = psutil.sensors_temperatures()
    if len(temp_data) != 0:
        highest_temp = 0.0
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

async def pipe_message_handler(websocket, message):
    if message[0] == "REQUEST_CONFIG":
        await send_config(websocket)
    elif message[0] == "SYNC_SPEED":
        msg = {}
        # Create message with type and value of the speed
        msg[message[1] + "_speed"] = message[2]
        await websocket.send(json.dumps(msg))
        print("SERVER: Syncronized speed setting")

async def send_config(websocket):
    # Prepare config file to be sent to client
    config = json.load(open('robot.json'))
    msg = {"config": config}
    await websocket.send(json.dumps(msg))
    print("SERVER: Sent configuration file")

async def send_sensor_data(websocket, path):
    print("SERVER: Client connected")
    # Send the configuration file on startup
    await send_config(websocket)
    while True:
        try:
            # Check if there are messages ready to be received
            if pipe.poll():
                # Handle message (received from control_receiver.py)
                await pipe_message_handler(websocket, pipe.recv())
            # Send sensor data etc
            await websocket.send(get_data())
        except websockets.exceptions.ConnectionClosed:
            print("SERVER: Client disconnected")
            break


def main():
    print("SERVER: Starting sensor data server")
    start_server = websockets.serve(
        send_sensor_data, config['network']['ip'], 5556)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()


if __name__ == '__main__':
    main()
