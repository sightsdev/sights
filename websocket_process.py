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
        # Load config file
        self.config_file = config_file
        self.config = json.load(open(self.config_file))
        # WebSocket port
        self.port = port

    def run(self):
        self.logger.info("Starting " + self.name + " process")
        start_server = websockets.serve(self.main, self.config['network']['ip'], self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        self.logger.info("Exiting " + self.name + " process")
 