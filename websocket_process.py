import websockets
import asyncio
import multiprocessing
import json
import logging

class WebSocketProcess (multiprocessing.Process):
    def __init__(self, mpid, pipe, config_file, port):
        multiprocessing.Process.__init__(self)
        self.logger = logging.getLogger(__name__)
        # Process ID
        self.mpid = mpid
         # Communication port to other processes
        self.pipe = pipe
        # Store config filename
        self.config_file = config_file
        # Load config file
        self.config = json.load(open(self.config_file))
        # WebSocket port
        self.port = port
        # IP address to bind to
        if 'network' in self.config:
            self.ip = self.config['network']['ip'] 
        else:
            self.ip = '*'

    def run(self):
        self.logger.info("Starting " + self.name + " process at " + self.ip + ":" + str(self.port))
        start_server = websockets.serve(self.main, self.ip, self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        self.logger.info("Exiting " + self.name + " process")
 
