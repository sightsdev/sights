#!/usr/bin/env python3
import logging
import serial
import os
from plugin_system import PluginManager
from motor_wrapper import MotorWrapper
from motors.virtual import VirtualConnection
from motors.dynamixel import DynamixelConnection
from motors.sabertooth import SabertoothConnection

class Motors:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        # Create new plugin manager looking for subclasses of MotorWrapper in "src/motors/"
        self.pm = PluginManager(MotorWrapper, os.getcwd() + "/src/motors")
        # Load values from configuration file
        self.type = config['motors']['type'].lower()
        if (self.type != 'virtual'):
            self.port = config['motors']['port']
            self.baudrate = config['motors']['baudrate']
        self.gamepad_speed = config['control']['default_gamepad_speed'] * 128 - 1
        self.keyboard_speed = config['control']['default_keyboard_speed'] * 128 - 1
        self.last_left = 0
        self.last_right = 0
        # Whether to use a virtual or real servo connection
        if (self.type == 'virtual'):
            self.connection = VirtualConnection()
        elif (self.type in ['serial', 'dynamixel']):
            try:
                if (self.type == 'serial'):
                    self.connection = SabertoothConnection(self.port, self.baudrate)
                elif (self.type == 'dynamixel'):
                    self.connection = DynamixelConnection(self.port, self.baudrate)
                    self.connection.ids = config['motors']['ids']
            except serial.serialutil.SerialException:
                self.logger.warning(f"Unable to create {self.type} motor connection")
                self.logger.info("Falling back to virtual connection")
                self.connection = VirtualConnection()
                self.type = 'virtual'
        else:
            self.logger.warning("Could not determine motor connection type")
            self.logger.info("Falling back to virtual connection")
            self.connection = VirtualConnection()
            self.type = 'virtual'
        self.logger.info(f"Opening motor connection of type '{self.type}'")
        # Ensure Connection class has access to logging capabilities
        self.connection.logger = self.logger
        
    def stop(self):
        # Set all servos to 0
        self.connection.stop()
        self.last_left = 0
        self.last_right = 0

    def close(self):
        self.logger.info("Closing motor connection")
        # Set all servos to 0 and close connection
        self.connection.stop()
        self.connection.close()

    def move(self, left, right, independent=False):
        # Make sure we don't have any decimals
        left = round(left)
        right = round(right)

        if (independent):
            # Allow left and right to be independent
            if (left != self.last_left):
                self.connection.move_raw(left=left)
            if (right != self.last_right):
                self.connection.move_raw(right=right)
        else:
            # Not independent, both left and right must have changed
            if (left != self.last_left and right != self.last_right):
                self.connection.move_raw(left, right)

        # Store this message for comparison next time
        self.last_left = left
        self.last_right = right
