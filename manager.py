#!/usr/bin/env python3
from multiprocessing import Pipe
from argparse import ArgumentParser
from control_receiver import ControlReceiver
from sensor_stream import SensorStream
import signal
import sys
import os

class Manager:
    def __init__(self, args):
        print("MANAGER: Starting manager process")
        # Store config file name
        self.config_file = args.config_file
        # Get the directory that this script exists in, in typical ugly Python fashion
        self.path = os.path.dirname(os.path.realpath(__file__))

    def terminate(self):
        # Terminate the two processes we spawn
        self.sensor_process.terminate()
        self.control_process.terminate()
        self.sensor_process.join()
        self.control_process.join()

    def sigint(self, signal, frame):
        print("MANAGER: Received {} signal. Terminating.".format(signal))
        # Make sure we terminate the child processes to prevent a zombie uprising
        self.terminate()
        # Also kill this process too
        sys.exit(0)

    def run(self):
        # Save process ID to file
        self.pid = str(os.getpid())
        with open(path + '/../sart.pid', 'w') as f:
            f.write(self.pid)
        print("MANAGER: PID", self.pid)
        # Create pipe. sensor_pipe receives, and control_pipe sends
        self.sensor_pipe, self.control_pipe = Pipe(duplex=False)
        # Create server and receiver processes
        self.sensor_process = SensorStream(1, self.sensor_pipe, self.config_file)
        self.control_process = ControlReceiver(2, self.control_pipe, self.config_file)
        # Create pipe for control_process to manager communication
        self.manager_pipe, self.super_pipe = Pipe(duplex=False)
        self.control_process.manager_pipe = self.super_pipe
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.sigint)
        # Start new processes
        self.sensor_process.start()
        self.control_process.start()
        # Receive any messages sent from control_gamepad
        message = self.manager_pipe.recv()
        if message[0] == "RESTART_SCRIPTS":
            # Restart everything
            print("MANAGER: Restarting processes")
            # Terminate child processes
            self.terminate()
            # Restart
            return True
        elif message[0] == "KILL_SCRIPTS":
            # Kill everyone
            print("MANAGER: Terminating processes")
            # Terminate child processes
            self.terminate()
            # Do not restart
            return False
        print("MANAGER: Exiting manager process")

if __name__ == '__main__':
    # Get the directory that this script exists in, in typical ugly Python fashion
    path = os.path.dirname(os.path.realpath(__file__))

    # Setup argument parser for config file loading
    parser = ArgumentParser()
    # Create argument for config file
    parser.add_argument("-c", "--config", 
                        dest="config_file", 
                        help="load specified configuration file", 
                        metavar="<file>", 
                        default=path+"/robot.json")
    # Actually parse the arguments
    args = parser.parse_args()
    
    # Create manager object
    manager = Manager(args)
    
    # Main program loop
    # If the restart flag is enabled we want to run the main function
    while(manager.run()):
        print("MANAGER: Going to restart")
    print("MANAGER: All processes ended")
