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


class ServoBackgroundService(multiprocessing.Process):
    def __init__(self, mpid, pipe, connection, servos: List[ServoModel]):
        multiprocessing.Process.__init__(self)
        self.mpid = mpid
        self.pipe = pipe
        self.connection = connection
        self.logger = logging.getLogger(__name__)
        self.moving_servos = dict()
        self.servos = dict([(s.channel, s) for s in servos])

    def set_speed(self, channel, vel):
        if vel == 0:
            self.stop([channel])
        else:
            self.moving_servos[channel] = int(vel*self.servos[channel].speed)

    def stop(self, channels=None):
        if channels is None:
            self.moving_servos = dict()
        else:
            for channel in channels:
                self.moving_servos.pop(channel, None)

    async def main(self, websocket, path):
        self.t = -10000000000000000000000
        # Enter runtime loop
        while True:
            if self.pipe.poll():
                message = self.pipe.recv()
                if message[0] == "SPEED":
                    self.logger.info(f"Set Speed: ch {message[1]} @ {message[2]}")
                    self.set_speed(message[1], message[2])
                elif message[0] == "STOP":
                    self.logger.info("STOP")
                    self.stop(message[1])
            await aio.sleep(0.05)
            if (perf_counter()-self.t)* 1_000 > 10:  
                self.logger.info(f"Updating {self.moving_servos}")
                for channel, vel in self.moving_servos.items():
                    self.servos[channel].pos = self.connection.go_to(self.servos[channel].pos +
                                                                vel)
                self.t = perf_counter()


class ServoHandler:
    def __init__(self, config):
        # Setup logger
        self.logger = logging.getLogger(__name__)

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
        Servos = []
        self.logger.info(f"Debug message 4")
        for servo, conf in config['servos']['instances'].items():
            Servos.append(self.connection.create_servo_model(int(servo), conf))
        self.logger.info(f"Debug message 5")

        #piper, self.pipe = Pipe(duplex=False)
        #self.logger.info("Background service will shortly begin")
        #self.background_service = ServoBackgroundService(3, piper, self.connection,
        # Servos)
        # Start new processes
        #self.background_service.start()
        #self.logger.info("Background service has begun")
    
    def go_to_pos(self, channel, pos):
        self.connection.go_to(channel, pos)

    def go_to_pos_async(self, channel, pos):
        self.connection.go_to_async(channel, pos)
    
    def move(self, channel, speed):
        self.logger.info(f"Moving channel {channel} at {speed}")
        self.pipe.send(["SPEED", channel, max(-1, min(1, speed))])
    
    def stop(self, channel=None):
        if channel is None:
            # stop all servos
            self.pipe.send(["STOP", None])
            self.connection.stop()
        else:
            self.pipe.send(["STOP", channel])
            self.connection.stop(channel)


    def close(self):
        self.logger.info("Closing servo connection")
        # Set all servos to 0 and close connection
        self.stop()
        self.background_service.close()
        self.connection.close()
