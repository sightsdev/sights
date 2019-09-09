#!/usr/bin/env python3
from multiprocessing import Pipe
from control_receiver import ControlReceiver
from sensor_stream import SensorStream

# Used to handle restarting the scripts
restartFlag = True

def main():
    restartFlag = False
    print("MANAGER: Starting manager process")
    # Create pipe. sensor_pipe receives, and control_pipe sends
    sensor_pipe, control_pipe = Pipe(duplex=False)
    # Create server and receiver processes
    sensor_process = SensorStream(1, sensor_pipe)
    control_process = ControlReceiver(2, control_pipe)
    # Create pipe for control_process to manager communication
    manager_pipe, super_pipe = Pipe(duplex=False)
    control_process.manager_pipe = super_pipe
    # Start new processes
    sensor_process.start()
    control_process.start()
    while True:
        # Check if there are messages ready to be received
        # Normally these are received by sensor_stream but we use them to check for manager requests too
        if manager_pipe.poll():
            # Handle message (received from control_receiver.py)
            message = manager_pipe.recv()
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
