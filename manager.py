#!/usr/bin/env python3
from multiprocessing import Pipe
from argparse import ArgumentParser
from control_receiver import ControlReceiver
from sensor_stream import SensorStream
import signal
import sys
import os
import logging
import multiprocessing_logging

class Manager:
    def __init__(self, args, logger):
        self.logger = logger
        self.logger.info("Starting manager process")
        # Store config file name
        self.config_file = args.config_file
        self.logger.info("Using config file: " + self.config_file)
        # Get the directory that this script exists in, in typical ugly Python fashion
        self.path = os.path.dirname(os.path.realpath(__file__))

    def terminate(self):
        # Terminate the two processes we spawn
        self.sensor_process.terminate()
        self.control_process.terminate()
        self.sensor_process.join()
        self.control_process.join()

    def sigint(self, signal, frame):
        self.logger.info("Received INT signal. Terminating.")
        # Make sure we terminate the child processes to prevent a zombie uprising
        self.terminate()
        # Also kill this process too
        sys.exit(0)

    def run(self):
        # Save process ID to file
        self.pid = str(os.getpid())
        with open(path + '/../sart.pid', 'w') as f:
            f.write(self.pid)
        self.logger.info("PID {}".format(self.pid))
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
            self.logger.info("Restarting processes")
            # Terminate child processes
            self.terminate()
            # Restart
            return True
        elif message[0] == "KILL_SCRIPTS":
            # Kill everyone
            self.logger.info("Terminating processes")
            # Terminate child processes
            self.terminate()
            # Do not restart
            return False
        self.logger.info("Exiting manager process")

if __name__ == '__main__':
    # Setup logger
    logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(asctime)s %(levelname)s %(name)s: %(message)s') #filename='/opt/sart/sart_robot.log', 
    multiprocessing_logging.install_mp_handler()
    logger = logging.getLogger(__name__)
    
    # Get the directory that this script exists in, in typical ugly Python fashion
    path = os.path.dirname(os.path.realpath(__file__))

    # Get active config from ACTIVE_CONFIG file
    try:
        with open(path+"/configs/ACTIVE_CONFIG", 'r') as f:
            default_config = path + "/configs/" + f.read()
    # Otherwise fallback to default.json
    except FileNotFoundError:
        default_config = path + "/configs/default.json"
    
    # Setup argument parser for config file loading
    parser = ArgumentParser()
    # Create argument for config file
    parser.add_argument("-c", "--config", 
                        dest="config_file", 
                        help="load specified configuration file", 
                        metavar="<file>", 
                        default=default_config)
    # Actually parse the arguments
    args = parser.parse_args()
    
    # Create manager object
    manager = Manager(args, logger)
    
    # Main program loop
    # If the restart flag is enabled we want to run the main function
    while(manager.run()):
        logger.info("Going to restart")
    logger.info("All processes ended")
