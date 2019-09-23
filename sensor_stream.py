#!/usr/bin/env python3
from smbus2 import SMBus
from websocketprocess import WebSocketProcess
from sensors import *
import websockets
import asyncio
import psutil
import json
import serial

class SensorStream(WebSocketProcess):
    def __init__(self, mpid, pipe, config_file):
        WebSocketProcess.__init__(self, mpid, pipe, config_file, 5556)
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
        #self.i2cbus = SMBus(1)
        self.sensors = []
        #self.sensors.append(SGP30Wrapper(bus))
        #self.sensors.append(MLX90614Wrapper(bus))
        self.sensors.append(CPUTempWrapper())
        self.sensors.append(MemoryWrapper())

        for sensor in self.sensors:
            sensor.load_config(self.config['sensors'])

    def get_data(self):
        # Create empty message
        msg = {}

        # i2c devices
        for sensor in self.sensors:
            if (sensor.ready()):
                data = sensor.get_data()
                msg.update(data)

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
        self.config = json.load(open(self.config_file))
        msg = {"config": self.config}
        await self.websocket.send(json.dumps(msg))
        print("SERVER: Sent configuration file")

    async def send_speed_value(self, typ, speed):
        msg = {}
        # Create message with type and value of the speed
        msg[typ + "_speed"] = speed
        await self.websocket.send(json.dumps(msg))
        print("SERVER: Syncronized speed setting")

    async def send_init_info(self):
        msg = {}
        # Send the configuration file on startup
        msg["config"] = self.config
        # Even though these are part of the config object, we send them seperately
        # Since we don't want the speed resetting every time we edit the config 
        msg["kb_speed"] = self.config['control']['default_keyboard_speed'] * 128 - 1
        msg["gp_speed"] = self.config['control']['default_gamepad_speed'] * 128 - 1
        # System uptime, as time in seconds since boot
        with open('/proc/uptime', 'r') as f:
            msg["uptime"] = round(float(f.readline().split()[0]))
        # Get RAM, add to message, use bit shift operator to represent in MB
        msg["memory_total"] = psutil.virtual_memory().total >> 20
        # Send message to interface
        await self.websocket.send(json.dumps(msg))
        print("SERVER: Send initial message")

    async def main(self, websocket, path):
        print("SERVER: Client connected")
        # Store websocket
        self.websocket = websocket
        # Send the configuration file, default speeds, etc.
        await self.send_init_info()
        # Enter runtime loop
        while True:
            try:
                # Check if there are messages ready to be received
                if self.pipe.poll():
                    # Handle message (received from control_receiver.py)
                    await self.pipe_message_handler(self.pipe.recv())
                # Send sensor data etc
                data = self.get_data()
                # Make sure data is not empty
                if data != "{}":
                    await websocket.send(data)
                # Short sleep to prevent issues
                await asyncio.sleep(0.05)
            except websockets.exceptions.ConnectionClosed:
                print("SERVER: Client disconnected")
                break
