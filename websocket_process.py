import websockets
import asyncio
import multiprocessing
import json

class WebSocketProcess (multiprocessing.Process):
    def __init__(self, mpid, pipe, config_file, port):
        multiprocessing.Process.__init__(self)
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
        print("MANAGER: Starting " + self.name + " process")
        start_server = websockets.serve(self.main, self.config['network']['ip'], self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        print("MANAGER: Exiting " + self.name + " process")
 