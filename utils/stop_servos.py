#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Emergency stop servos
# Connects to Dynamixels via USB2AX connection, regardless of port settings.
# Searches for USB2AX devices by name

from pyax12.connection import Connection
import os

# List of types of devices to search for
matchers = ['USB2AX']

# Search serial devices for items that match the 'matchers' array
contents = os.listdir("/dev/serial/by-id/")
devices = [s for s in contents if any(xs in s for xs in matchers)]

# Print a message if we find no such devices
if not devices:
    print("Could not find any USB2AX devices")

# For each USB2AX
for dev in devices:
    # Get full path to serial port
    port = "/dev/serial/by-id/" + dev
    # Print message to console
    print("Attempting to connect to", port)
    # Open connection
    sc = Connection(port=port, baudrate=1000000)
    # Set all motors to zero
    sc.set_speed(1, 0)
    sc.set_speed(2, 0)
    sc.set_speed(3, 0)
    sc.set_speed(4, 0)
    # Close the connection
    sc.close()
