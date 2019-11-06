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
        with open(path + '/../sights.pid', 'w') as f:
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
    logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
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
    try:
        while(manager.run()):
            logger.info("Going to restart")
    except KeyError:
        # Restore rolling backups when there is a config error
        config_dir = os.path.dirname(default_config)
        name = os.path.basename(default_config)
        # Keep a copy of the invalid config for the user to review
        if os.path.isfile(config_dir + "/" + name):
            os.rename(config_dir + "/" + name, config_dir + "/last_invalid_config.json")
        logger.warning("Config error! Review your last_invalid_config.json")
        # Keep trying until a backup is restored or there are no backups available (handles missing backups)
        while (not os.path.isfile(config_dir + "/" + name)) and any(name in file for file in os.listdir(config_dir)):
            # Find existing backups for this config file
            for file in sorted(os.listdir(config_dir)):
                if file.startswith(f"{name}.backup."):
                    # Get backup ID
                    id = int(file[-1])
                    if id == 0:
                        # Replace invalid config with most recent backup
                        os.rename(config_dir + "/" + name + ".backup.0", config_dir + "/" + name)
                        logger.warning(f"Restored {name} config from backup.")
                    else:
                        # Subtract 1 from the rest of the backup IDs
                        new_id = str(id - 1)
                        os.rename(config_dir + "/" + file, config_dir + "/" + name + ".backup." + new_id)
        # If all else fails enter "safe mode" with a minimal known valid config
        if not any(name in file for file in os.listdir(config_dir)):
            logger.warning("No backups to restore, entering safe mode with minimal config.")
            os.popen(f"cp {config_dir}/internal/minimal.json {config_dir}/{name}")
    else:
        logger.info("All processes ended")
