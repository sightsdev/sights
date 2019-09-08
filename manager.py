#!/usr/bin/env python3
import os
import websockets
import json
import multiprocessing
import asyncio
import control_receiver
import sensor_stream

# Load config file
f = open('robot.json')
config = json.load(f)

# Used to handle restarting the scripts
restartFlag = True

# Create pipe
alpha_pipe, beta_pipe = multiprocessing.Pipe()

class WebSocketProcess (multiprocessing.Process):
    def __init__(self, proc, name, func, port, pipe, context):
        multiprocessing.Process.__init__(self)
        self.proc = proc
        self.name = name
        self.func = func
        self.port = port
        context.pipe = pipe

    def run(self):
        print("MANAGER: Starting " + self.name + " process")
        start_server = websockets.serve(
            self.func, config['network']['ip'], self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        print("MANAGER: Exiting " + self.name + " process")

def main():
    restartFlag = False
    print("MANAGER: Starting manager process")
    # Create new process
    sensor_process = WebSocketProcess(
        1, "sensor data server", sensor_stream.send_sensor_data, 5556, alpha_pipe, sensor_stream)
    control_process = WebSocketProcess(
        2, "control data receiver", control_receiver.receive_control_data, 5555, beta_pipe, control_receiver)
    # Start new processes
    sensor_process.start()
    control_process.start()
    while True:
        # Check if there are messages ready to be received
        # Normally these are received by sensor_stream but we use them to check for manager requests too
        if alpha_pipe.poll():
            # Handle message (received from control_receiver.py)
            message = alpha_pipe.recv()
            if message[0] == "RESTART_SCRIPTS":
                # Restart everything
                print("MANAGER: Terminating processes")
                sensor_process.terminate()
                control_process.terminate()
                sensor_process.join()
                control_process.join()
                restartFlag = True
                break
    print("MANAGER: Exiting manager process")


if __name__ == '__main__':
    try:
        # If the restart flag is enabled we want to run the main function
        while (restartFlag):
            main()
    except KeyboardInterrupt:
        pass


