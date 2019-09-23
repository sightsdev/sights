#!/usr/bin/env python3
from multiprocessing import Pipe
from argparse import ArgumentParser
from control_receiver import ControlReceiver
from sensor_stream import SensorStream

def main(args):
    print("MANAGER: Starting manager process")
    config_file = args.config_file
    # Create pipe. sensor_pipe receives, and control_pipe sends
    sensor_pipe, control_pipe = Pipe(duplex=False)
    # Create server and receiver processes
    sensor_process = SensorStream(1, sensor_pipe, config_file)
    control_process = ControlReceiver(2, control_pipe, config_file)
    # Create pipe for control_process to manager communication
    manager_pipe, super_pipe = Pipe(duplex=False)
    control_process.manager_pipe = super_pipe
    # Start new processes
    sensor_process.start()
    control_process.start()
	# Receive any messages sent from control_gamepad
    message = manager_pipe.recv()
    if message[0] == "RESTART_SCRIPTS":
        # Restart everything
        print("MANAGER: Restarting processes")
        sensor_process.terminate()
        control_process.terminate()
        sensor_process.join()
        control_process.join()
        return True
    elif message[0] == "KILL_SCRIPTS":
        # Kill everyone
        print("MANAGER: Terminating processes")
        sensor_process.terminate()
        control_process.terminate()
        sensor_process.join()
        control_process.join()
        return False
    print("MANAGER: Exiting manager process")


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument("-c", "--config", dest="config_file",
                        help="load specified configuration file", metavar="<file>", default="robot.json")
    args = parser.parse_args()
    try:
        # If the restart flag is enabled we want to run the main function
        while(main(args)):
            print("MANAGER: Going to restart")
        print("MANAGER: All processes ended")
    except KeyboardInterrupt:
        pass
