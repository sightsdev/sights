#!/usr/bin/env python3
import logging
from time import perf_counter
import serial
import os
import traceback
from multiprocessing import Pipe
import multiprocessing
from websocket_process import WebSocketProcess
import asyncio as aio
from plugin_system import PluginManager
from servo_wrapper import ServoWrapper, ServoModel
from servos.virtual import VirtualConnection
from typing import List, Optional


class ServoHandler:
    def __init__(self, config, pipe):
        # Setup logger
        self.logger = logging.getLogger(__name__)
        self.pipe = pipe
        self.config = config
        # Create new plugin manager looking for subclasses of MotorWrapper in "src/motors/"
        self.pm = PluginManager(ServoWrapper, os.getcwd() + "/src/servos")
        # Load values from configuration file
        self.type = config['servos']['type'].lower()
        # Log loaded type
        self.logger.info(f"Opening servo connection of type '{self.type}'")
        try:
            # Create servo connection (from a list loaded by the plugin manager) using
            # class specified in the config
            self.connection: ServoWrapper = self.pm.wrappers[self.type](config['servos'])
        except Exception as e:
            if isinstance(e, KeyError):
                self.logger.error(f"Could not determine servo connection type "
                                  f"'{self.type}'")
            elif isinstance(e, serial.serialutil.SerialException):
                self.logger.error(f"Could not open servo connection of type '{self.type}'")
            else:
                traceback.print_exc()
            # Fall back to virtual connection common to all servo connection errors
            self.logger.warning("Falling back to virtual connection")
            self.connection = VirtualConnection(config['servos'])
            self.type = 'virtual'
        self.logger.info(f"Debug message 3")
        # Ensure Connection class has access to logging capabilities
        self.connection.logger = self.logger
        Servos = {}
        self.logger.info(f"Debug message 4")
        for servo, conf in config['servos']['instances'].items():
            if servo in config['arm'].values():
                part = [k for k, v in config['arm'].items() if v == servo][0]
            else:
                part = None
            Servos[int(servo)] = self.connection.create_servo_model(int(servo), conf, part)
        self.logger.info(f"Debug message 5")
        self.Servos = Servos

    def get_initial_messages(self):
        msg = []
        for servo in [s for s in self.Servos.values() if s.part is not None]:
            msg.append([servo.part, servo.pos])
        return {"SERVO_POS": msg}

    
    def go_to_pos(self, channel, pos):
        self.Servos[channel].pos = pos
        self.connection.go_to(channel, pos)
        if self.Servos[channel].part is not None:
            self.logger.debug("Sending updated servo pos of {}".format(self.Servos[channel].part))
            self.pipe.send(["SERVO_POS", self.Servos[channel].part, pos])

    def go_to_pos_async(self, channel, pos):
        self.Servos[channel].pos = pos
        self.connection.go_to_async(channel, pos)
        if self.Servos[channel].part is not None:
            self.pipe.send(["SERVO_POS", self.Servos[channel].part, pos])
    
    def move(self, channel, speed):
        pass
    
    def stop(self):
        self.connection.stop()


    def close(self):
        self.logger.info("Closing servo connection")
        # Set all servos to 0 and close connection
        self.stop()
        self.connection.close()
