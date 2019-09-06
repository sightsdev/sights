#!/usr/bin/env python3
import os
import websockets
import configparser
import multiprocessing
import asyncio
import control_gamepad
import sensor_stream

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
        print("MANAGER: Starting " + self.name + " thread")
        start_server = websockets.serve(
            self.func, config.get('network', 'ip') self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        print("MANAGER: Exiting " + self.name + " thread")

def main():
    print("MANAGER: Starting manager process")
    # Create new threads
    sensorThread = WebSocketThread(
        1, "sensor data server", sensor_stream.sendSensorData, 5556)
    controlThread = WebSocketThread(
        2, "control data receiver", control_gamepad.recieveControlData, 5555)
    # Start new Threads
    sensorThread.start()
    controlThread.start()
    sensorThread.join()
    controlThread.join()
    print("MANAGER: Exiting manager process")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        pass


