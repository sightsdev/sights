#!/usr/bin/env python3
from smbus2 import SMBus
from websocket_process import WebSocketProcess
from sensor_wrapper import SensorWrapper
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
from plugin_system import PluginManager


class SensorStream(WebSocketProcess):
    def __init__(self, mpid, pipe, config_file, init_msgs=None):
        WebSocketProcess.__init__(self, mpid, pipe, config_file, 5556)
        # Setup logger
        self.logger = logging.getLogger(__name__)

        # Create new plugin manager looking for subclasses of SensorWrapper in "src/sensors/"
        self.pm = PluginManager(SensorWrapper, os.getcwd() + "/src/sensors")

        # Save any messages to send in first message to websock
        self.init_msgs = init_msgs
        # Create dict to store the number of each type of sensor
        self.sensor_count = {}

        # Create list of sensors
        self.sensors = []

        # Load sensors from config file
        for sensor_config in self.config['sensors']:
            if sensor_config.get('enabled', False):
                # Find the appropriate wrapper class and create the sensor object
                type_ = sensor_config['type']
                sensor = self.pm.wrappers[type_](sensor_config)
                # Count the number of times we create a sensor of this type, to assign a unique id
                if type_ not in self.sensor_count:
                    self.sensor_count[type_] = 1
                else:
                    self.sensor_count[type_] += 1
                # Assign index
                sensor.index = self.sensor_count[type_]
                # Add to list of sensors
                self.sensors.append(sensor)
                self.logger.info(f"Created sensor of type '{type_}' (#{sensor.index})")
        self.logger.info(f"Loaded {len(self.sensors)} sensors")

    def get_data(self):
        # Create empty message
        msg = {}

        # Ensure that the time is the same across sensors
        now = time.time()

        # Get data from each Sensor
        for sensor in self.sensors:
            # Ensure time elapsed is greater than period
            if sensor.is_ready(now):
                data = sensor.get_data()
                # Make sure we actually got data from the sensor
                if data is not None:
                    # Generate UID for sensor
                    uid = f"{sensor.type_}_{sensor.index}"
                    # Any sensor data handled automatically (anything in this for loop) goes in the "sensor_data" dict
                    if "sensor_data" not in msg:
                        msg["sensor_data"] = {}
                    # Create message
                    msg["sensor_data"][uid] = data
        # Print out each message if print_messages is enabled
        if self.config['debug']['print_messages'] and bool(msg):
            self.logger.info(msg)
        # Return message to be sent to control panel
        return json.dumps(msg)

    async def pipe_message_handler(self, msg):
        # If we receive a message from ControlReceiver with a new speed, set that to our speed
        if msg[0] == "SYNC_SPEED":
            await self.send_speed_value(msg[1])
        elif msg[0] == "SERVO_POS":
            await self.send_pos_value(msg[1], msg[2])

    async def send_pos_value(self, target, value):
        msg = {"arm_position": [{"target": target, "position": value}]}
        await self.websocket.send(json.dumps(msg))
        self.logger.debug("Synchronised {} position".format(target))

    async def send_speed_value(self, speed):
        # Create message with type and value of the speed
        msg = {"speed": speed}
        # Send current speed to be displayed on the interface
        await self.websocket.send(json.dumps(msg))
        self.logger.debug("Synchronised speed setting")

    async def send_init_info(self):
        msg = {}
        if self.init_msgs is not None:
            for message in self.init_msgs:
                if message == "SERVO_POS":
                    pos = []
                    for sp in self.init_msgs[message]:
                        pos.append({"target": sp[0], "position": sp[1]})
                    msg["arm_position"] = pos

        msg["initial_message"] = True
        msg["running_config"] = os.path.basename(self.config_file)
        # Even though these are part of the config object, we send them separately
        # Since we don't want the speed resetting every time we edit the config 
        msg["speed"] = self.config['control']['default_speed'] * 128 - 1
        # System uptime, as time in seconds since boot
        with open('/proc/uptime', 'r') as f:
            msg["uptime"] = round(float(f.readline().split()[0]))
        # Send software versions
        msg["version_sights"] = subprocess.check_output(["git", "describe"]).strip().decode('utf-8')
        # msg["version_vision"] = subprocess.check_output(["git", "describe"],
        #                                                  cwd="../SIGHTSVision/").strip().decode('utf-8')
        msg["available_plugins"] = self.pm.plugins
        # Get intital data from each Sensor
        for sensor in self.sensors:
            # Send both the normal data from the sensor 
            data = sensor.get_data()
            # As well as the inital data (stuff that only needs to be sent once, at the start)
            initial_data = sensor.get_initial()
            # Generate UID for sensor
            uid = f"{sensor.type_}_{sensor.index}"
            # Make sure we actually got data from the sensor
            if data is not None:
                # Any sensor data handled automatically (anything in this for loop) goes in the "sensor_data" dict
                if "sensor_data" not in msg:
                    msg["sensor_data"] = {}
                # Create message
                msg["sensor_data"][uid] = data
            # Make sure we actually got data from the sensor
            if initial_data is not None:
                # Any sensor data handled automatically (anything in this for loop) goes in the "sensor_data" dict
                if "initial_sensor_data" not in msg:
                    msg["initial_sensor_data"] = {}
                # Create message
                msg["initial_sensor_data"][uid] = initial_data
        # Send message to interface
        await self.websocket.send(json.dumps(msg))
        self.logger.debug("Sent initial message")

    async def main(self, websocket, path):
        self.logger.info(f"New client connected ({websocket.remote_address[0]})")
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
                self.logger.info(f"Client disconnected ({websocket.remote_address[0]})")
                break
        # Close each sensor
        for sensor in self.sensors:
            sensor.close()
