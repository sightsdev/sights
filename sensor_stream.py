#!/usr/bin/env python3
import websockets
import asyncio
import psutil
import json
import serial
#from smbus2 import SMBusWrapper
#from PySGP30 import SGP30
#from PyMLX90614 import MLX90614
from datetime import timedelta
from websocketprocess import WebSocketProcess

class SensorStream(WebSocketProcess):
    def __init__(self, mpid, pipe):
        WebSocketProcess.__init__(self, mpid, pipe, 5556)
        # Load config file
        self.config = json.load(open('robot.json'))
        # Check if Arduino is enabled in config file
        self.arduino_enabled = self.config['arduino']['enabled']

        if (self.arduino_enabled):
            try:
                # Attempt to open serial com with Arduino
                self.ser = serial.Serial(port=self.config['arduino']['port'],
                                    baudrate=self.config['arduino']['baudrate'])
            except serial.serialutil.SerialException:
                print("SERVER: Error: Could not open Arduino serial port. Is the correct port configured 'robot.cfg'?")
                print("SERVER: Continuing without Arduino connection\n")
                self.arduino_enabled = False
        # Setup i2c stuff
        #self.i2cbus = SMBusWrapper(1)
        #self.sgp = SGP30(bus)
		#self.sgp.init_sgp()
	    #self.temp = MLX90614(0x5A)

    def get_data(self):
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
        #msg["cpu_temp"] = str(psutil.sensors_temperatures()['thermal-fan-est'][0].current)

        # Get RAM in use and total RAM
        memory = psutil.virtual_memory()
        # Add to message, use bit shift operator to represent in MB
        msg["memory_used"] = str(memory.used >> 20)
        msg["memory_total"] = str(memory.total >> 20)

        # i2c devices
        #msg["co2"] = sgp.read_measurements()[0][0]
	    #msg["tvoc"] = sgp.read_measurements()[0][1]
	    #msg["temp"] = [round(temp.get_obj_temp(), 1)]

        # System uptime
        with open('/proc/uptime', 'r') as f:
            uptime_seconds = round(float(f.readline().split()[0]))
            msg["uptime"] = str(timedelta(seconds=uptime_seconds))

        # Get data from Arduino
        if self.arduino_enabled:
            buf = self.ser.readline().decode("UTF-8")
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

    async def pipe_message_handler(self, msg):
        if msg[0] == "REQUEST_CONFIG":
            await self.send_config()
        elif msg[0] == "SYNC_SPEED":
            await self.send_speed_value(msg[1], msg[2])
            
    async def send_config(self):
        # Prepare config file to be sent to client
        self.config = json.load(open('robot.json'))
        msg = {"config": self.config}
        await self.websocket.send(json.dumps(msg))
        print("SERVER: Sent configuration file")

    async def send_speed_value(self, typ, speed):
        msg = {}
        # Create message with type and value of the speed
        msg[typ + "_speed"] = speed
        await self.websocket.send(json.dumps(msg))
        print("SERVER: Syncronized speed setting")

    async def send_default_speeds(self):
        await self.send_speed_value("kb", self.config['control']['default_keyboard_speed'] * 128 - 1)
        await self.send_speed_value("gp", self.config['control']['default_gamepad_speed'] * 128 - 1)

    async def main(self, websocket, path):
        print("SERVER: Client connected")
        # Store websocket
        self.websocket = websocket
        # Send the configuration file on startup
        await self.send_config()
        # Also send the default gamepad and keyboard speeds
        await self.send_default_speeds()
        # Enter runtime loop
        while True:
            try:
                # Check if there are messages ready to be received
                if self.pipe.poll():
                    # Handle message (received from control_receiver.py)
                    await self.pipe_message_handler(self.pipe.recv())
                # Send sensor data etc
                await websocket.send(self.get_data())
            except websockets.exceptions.ConnectionClosed:
                print("SERVER: Client disconnected")
                break
