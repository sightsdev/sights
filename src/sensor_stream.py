#!/usr/bin/env python3
from smbus2 import SMBus
from websocket_process import WebSocketProcess
import importlib
import websockets
import asyncio
import psutil
import json
import serial
import logging
import os
import subprocess
import re
import sys
import inspect
import time

class SensorStream(WebSocketProcess):
    def __init__(self, mpid, pipe, config_file):
        WebSocketProcess.__init__(self, mpid, pipe, config_file, 5556)
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # Check if Arduino is enabled in config file
        self.arduino_enabled = self.config['arduino']['enabled']
        # Attempt to open Arduino serial connection
        if (self.arduino_enabled):
            try:
                # Attempt to open serial com with Arduino
                self.ser = serial.Serial(port=self.config['arduino']['port'],
                                    baudrate=self.config['arduino']['baudrate'])
            except serial.serialutil.SerialException:
                self.logger.error("Could not open Arduino serial port. Is the correct port configured 'robot.cfg'?")
                self.logger.info("Continuing without Arduino connection\n")
                self.arduino_enabled = False
        # Setup i2c stuff
        #self.i2cbus = SMBus(1)
        
        # Directory of sensor plugins
        self.plugin_dir = os.getcwd() + "/src/sensors"
        # Get list of available plugins
        self.plugins = self.get_plugins()
        # Create sensor name -> appropriate class lookup table
        self.wrappers = {}
        # Create dict to store the number of each type of sensor
        self.sensor_count = {}

        # Add plugin directory to path to ensure we can import modules from there
        if not self.plugin_dir in sys.path:
            sys.path.insert(0, self.plugin_dir)

        # Load each plugin
        for plugin_name in self.plugins:
            # Import the module
            plugin = importlib.import_module(plugin_name)
            # Iterate through all the available classes for this module and find the class that is the sensor wrapper
            classes = inspect.getmembers(plugin, inspect.isclass)
            class_ = None
            for c in classes:
                # 'type_' is a variable that is (hopefully) only on the sensor wrapper class
                if 'type_' in dir(c[1]):
                    # We've found the sensor wrapper class
                    class_ = c[1]
            # Assign the discovered class tot he appropriate key (eg. assign MLX90614Wrapper to sensors of type 'mlx90614')
            self.wrappers[class_.type_] = class_
            # Log information about enabled plugin
            self.logger.info(f"Enabling plugin '{plugin_name}' for '{class_.type_}' using class: {class_}")

        # Create list of sensors
        self.sensors = []
        
        # Load sensors from config file
        for sensor_config in self.config['sensors']:
            if sensor_config.get('enabled', False):
                # Find the appropriate wrapper class and create the sensor object
                type_ = sensor_config['type']
                sensor = self.wrappers[type_](sensor_config)
                # Count the number of times we create a sensor of this type, to assign a unique id
                if not type_ in self.sensor_count:
                    self.sensor_count[type_] = 1
                else:
                    self.sensor_count[type_] += 1
                # Assign index
                sensor.index = self.sensor_count[type_]
                # Add to list of sensors
                self.sensors.append(sensor)
                self.logger.info(f"Created sensor of type '{type_}' (#{sensor.index})")
        self.logger.info(f"Loaded {len(self.sensors)} sensors")
        

    def get_plugins(self):
        """Adds plugins to sys.path and returns them as a list"""
        registered_plugins = []
        # Check to see if a plugins directory exists and add any found plugins
        if os.path.exists(self.plugin_dir):
            plugins = os.listdir(self.plugin_dir)
            # Plugins are .py files
            pattern = ".py$"
            for plugin in plugins:
                plugin_path = os.path.join(self.plugin_dir, plugin)
                # Don't load __init__.py as plugin
                if plugin != "__init__.py":
                    if re.search(pattern, plugin):
                        (shortname, ext) = os.path.splitext(plugin)
                        registered_plugins.append(shortname)
                # Search in subdirectories too (one level deep)
                if os.path.isdir(plugin_path):
                    plugins = os.listdir(plugin_path)
                    for plugin in plugins:
                        if plugin != "__init__.py":
                            if re.search(pattern, plugin):
                                (shortname, ext) = os.path.splitext(plugin)
                                sys.path.append(plugin_path)
                                registered_plugins.append(shortname)
        else:
            self.logger.error("Couldn't find sensor plugin directory. SIGTHS is possibly running in wrong working directory.")
        return registered_plugins

    def get_data(self):
        # Create empty message
        msg = {}

        # Ensure that the time is the same across sensors
        now = time.time()

        # Get data from each Sensor
        for sensor in self.sensors:
            # Ensure time elapsed is greater than frequency
            if (sensor.is_ready(now)):
                data = sensor.get_data()
                # Make sure we actually got data from the sensor
                if data is not None:
                    if sensor.type_ not in msg:
                        msg[sensor.type_] = {}
                    # Create message
                    msg[sensor.type_][sensor.index] = {
                        "name": sensor.name,
                        "data": data
                    }

        # Get data from Arduino. This is only here for backwards compatibility
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
        if msg[0] == "SYNC_SPEED":
            await self.send_speed_value(msg[1], msg[2])

    async def send_speed_value(self, typ, speed):
        msg = {}
        # Create message with type and value of the speed
        msg[typ + "_speed"] = speed
        await self.websocket.send(json.dumps(msg))
        self.logger.info("Syncronized speed setting")

    async def send_init_info(self):
        msg = {}
        msg["initial_message"] = True
        msg["running_config"] = os.path.basename(self.config_file)
        # Even though these are part of the config object, we send them seperately
        # Since we don't want the speed resetting every time we edit the config 
        msg["kb_speed"] = self.config['control']['default_keyboard_speed'] * 128 - 1
        msg["gp_speed"] = self.config['control']['default_gamepad_speed'] * 128 - 1
        # System uptime, as time in seconds since boot
        with open('/proc/uptime', 'r') as f:
            msg["uptime"] = round(float(f.readline().split()[0]))
        # Get RAM, add to message, use bit shift operator to represent in MB
        msg["memory_total"] = psutil.virtual_memory().total >> 20
        # Send software versions
        msg["version_robot"] = subprocess.check_output(["git", "describe"]).strip().decode('utf-8')
        msg["version_interface"] = subprocess.check_output(["git", "describe"],
                                                           cwd="../SIGHTSInterface/").strip().decode('utf-8')
        msg["version_supervisorext"] = subprocess.check_output(["git", "describe"],
                                                           cwd="../supervisor_sights_config/").strip().decode('utf-8')
        # Send message to interface
        await self.websocket.send(json.dumps(msg))
        self.logger.info("Sent initial message")

    async def main(self, websocket, path):
        self.logger.info("Client connected")
        # Store websocket
        self.websocket = websocket
        # Send the initial info to notify interface that the service is ready.
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
                self.logger.info("Client disconnected")
                break
