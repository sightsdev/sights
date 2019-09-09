import websockets
import asyncio
import multiprocessing

class WebSocketProcess (multiprocessing.Process):
    def __init__(self, mpid, pipe, port):
        multiprocessing.Process.__init__(self)
        # Process ID
        self.mpid = mpid
         # Communication port to other processes
        self.pipe = pipe
        # WebSocket port
        self.port = port

    def run(self):
        print("MANAGER: Starting " + self.name + " process")
        start_server = websockets.serve(self.main, self.config['network']['ip'], self.port)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
        print("MANAGER: Exiting " + self.name + " process")
 