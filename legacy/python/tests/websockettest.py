import asyncio
import websockets
import random
import datetime

@asyncio.coroutine
def time(websocket, path):
	while True:
		now = datetime.datetime.utcnow().isoformat() + 'Z'
		yield from websocket.send(now)
		
		greeting = yield from websocket.recv()
		print ("< {}".format(greeting))
	
		
		
start_server = websockets.serve(time, '10.0.2.4', 5555)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
