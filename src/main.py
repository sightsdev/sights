#!/usr/bin/env python3
from multiprocessing import Pipe
from control_receiver import ControlReceiver
from sensor_stream import SensorStream
import signal
import sys
import os
import json
import logging
import multiprocessing_logging

class Manager:
    def __init__(self, config_file, logger):
        # Set up the logger
        self.logger = logger
        self.logger.info("Starting main process...")
        # Store config file name
        self.config_file = config_file
        self.logger.info(f"Loading config file: '{self.config_file}'...")

    def terminate(self):
        # Terminate the two processes we spawn
        self.sensor_process.terminate()
        self.control_process.terminate()
        # We should already have joined the processes, but just in case, this ensures we actually terminate
        self.sensor_process.join()
        self.control_process.join()

    def sigint(self, signal, frame):
        self.logger.info("Received interrupt signal. Terminating...")
        # Make sure we terminate the child processes to prevent a zombie uprising
        self.terminate()
        # Also kill this process too
        sys.exit(0)

    def run(self):
        # Log process ID to file
        self.logger.debug(f"Process ID (PID): {os.getpid()}")
        # Create pipe. sensor_pipe receives, and control_pipe sends
        self.sensor_pipe, self.control_pipe = Pipe(duplex=False)
        # Create server and receiver processes
        self.control_process = ControlReceiver(2, self.control_pipe, self.config_file)
        self.sensor_process = SensorStream(1, self.sensor_pipe, self.config_file,
                                           self.control_process.get_initial_messages())
        # Setup signal handlers
        signal.signal(signal.SIGINT, self.sigint)
        # Start new processes
        self.sensor_process.start()
        self.control_process.start()
        # Join new processes to prevent early termination
        self.sensor_process.join()
        self.control_process.join()
        # Once both processes have ended, the manager can end too.
        self.logger.info("Exiting main process...")


if __name__ == '__main__':
    # Get active config from ACTIVE_CONFIG file
    try:
        with open("configs/ACTIVE_CONFIG", 'r') as f:
            config_file = "configs/" + f.read()
            # Load config file
            config = json.load(open(config_file))
    # Otherwise fallback to minimal.json
    except FileNotFoundError:
        config_file = "src/configs/sights/minimal.json"
        config = json.load(open(config_file))

    # Log levels
    levels = {
        'critical': logging.CRITICAL,
        'error': logging.ERROR,
        'warning': logging.WARNING,
        'info': logging.INFO,
        'debug': logging.DEBUG
    }

    # Get the log level from the config. Default to logging.INFO
    log_level = levels.get(config["debug"].get("log_level", "info").lower(), logging.INFO)

    # Setup logger
    logging.basicConfig(level=log_level, stream=sys.stdout, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
    # Ensure multiprocessing compatibility
    multiprocessing_logging.install_mp_handler()
    # This ensures we know which script we are logging from
    logger = logging.getLogger(__name__)

    # Create manager object
    manager = Manager(config_file, logger)

    # Main program loop
    try:
        manager.run()
    except (KeyError, json.decoder.JSONDecodeError) as e:
        logger.error(f"Configuration file error! {e}  SIGHTS will now terminate.")
        logger.error("Review your config file or restore a backup.")
