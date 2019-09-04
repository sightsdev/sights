#!/usr/bin/env python3
from pyax12.connection import Connection
import subprocess
import os
import atexit
import websockets
import configparser
import threading
import asyncio
import time
import control_gamepad
import sensor_stream
import multiprocessing

# Load config file
config = configparser.ConfigParser()
config.read('robot.cfg')

class WebSocketThread (multiprocessing.Process):
   def __init__(self, threadID, name, func, port):
      multiprocessing.Process.__init__(self)
      self.threadID = threadID
      self.name = name
      self.func = func
      self.port = port
      
   def run(self):
      print("Starting " + self.name + " thread")
      start_server = websockets.serve(self.func, config['network']['ip'], self.port)
      asyncio.get_event_loop().run_until_complete(start_server)
      asyncio.get_event_loop().run_forever()
      print("Exiting " + self.name + " thread")

# Create new threads
sensorThread = WebSocketThread(1, "Sensor Data Server", sensor_stream.sendSensorData, 5556)
controlThread = WebSocketThread(2, "Control Data Receiver", control_gamepad.recieveControlData, 5555)

# Start new Threads
sensorThread.start()
controlThread.start()
sensorThread.join()
controlThread.join()
print ("Exiting Main Thread")