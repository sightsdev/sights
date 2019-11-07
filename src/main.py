#!/usr/bin/env python3
import json
from multiprocessing import Pipe
from control_receiver import ControlReceiver
from sensor_stream import SensorStream
import signal
import sys
import os
import logging
import multiprocessing_logging

class Manager:
    def __init__(self, config_file, logger):
        self.logger = logger
        self.logger.info("Starting manager process")
        # Store config file name
        self.config_file = config_file
        self.logger.info("Using config file: " + self.config_file)

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
        with open('../sights.pid', 'w') as f:
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

    # Get active config from ACTIVE_CONFIG file
    try:
        with open("configs/ACTIVE_CONFIG", 'r') as f:
            config_file = "configs/" + f.read()
    # Otherwise fallback to default.json
    except FileNotFoundError:
        config_file = "src/configs/sights/minimal.json"
    
    # Create manager object
    manager = Manager(config_file, logger)
    
    # Main program loop
    # If the restart flag is enabled we want to run the main function
    try:
        while(manager.run()):
            logger.info("Going to restart")
    except (KeyError, json.decoder.JSONDecodeError):
        # Restore rolling backups when there is a config error
        backup_dir = "src/configs/sights/backup/"
        # Just the name of the config
        name = os.path.basename(config_file)
        # Keep a copy of the invalid config for the user to review
        if os.path.isfile(config_file):
            os.rename(config_file, "configs/last_invalid_config.json")
        logger.warning("Config error! Review your last_invalid_config.json")
        # Keep trying until a backup is restored or there are no backups available (handles missing backups)
        while (not os.path.isfile(config_file)) and any(name in file for file in os.listdir(backup_dir)):
            # Find existing backups for this config file
            for file in sorted(os.listdir(backup_dir)):
                if file.startswith(f"{name}.backup."):
                    # Get backup ID
                    id = int(file[-1])
                    if id == 0:
                        # Replace invalid config with most recent backup
                        os.rename(f"{backup_dir}/{name}.backup.0", config_file)
                        logger.warning(f"Restored {name} config from backup.")
                    else:
                        # Subtract 1 from the rest of the backup IDs
                        new_id = str(id - 1)
                        os.rename(backup_dir + file, f"{backup_dir}/{name}.backup.{new_id}")
        # If all else fails enter "safe mode" with a minimal known valid config
        if not any(name in file for file in os.listdir("configs/")):
            logger.warning("No backups to restore, entering safe mode with minimal config.")
            os.popen(f"cp src/configs/sights/minimal.json {config_file}")
    else:
        logger.info("All processes ended")
