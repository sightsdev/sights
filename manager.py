#!/usr/bin/env python3
import os
import websockets
import multiprocessing
import asyncio
from control_receiver import ControlReceiver
from sensor_stream import SensorStream

# Used to handle restarting the scripts
restartFlag = True

class WebSocketProcess (multiprocessing.Process):
    def __init__(self, proc, name, instance):
        multiprocessing.Process.__init__(self)
        self.proc = proc
        self.name = name
        self.instance = instance

    def run(self):
        print("MANAGER: Starting " + self.name + " process")
        start_server = websockets.serve(
            self.instance.run, self.instance.config['network']['ip'], self.instance.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        print("MANAGER: Exiting " + self.name + " process")


def main():
    restartFlag = False
    print("MANAGER: Starting manager process")
    # Create pipe
    alpha_pipe, beta_pipe = multiprocessing.Pipe()
    # Create server and receiver objects
    server = SensorStream(alpha_pipe)
    receiver = ControlReceiver(beta_pipe)
    # Create new process
    sensor_process = WebSocketProcess(1, "sensor data server", server)
    control_process = WebSocketProcess(2, "control data receiver", receiver)
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
