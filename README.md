# SARTRobot
The scripts and programs written by the SFXRescue team for the SART v.2 rescue robot.
## Current
**Current** contains the code that is run on the robot. One should be able to simply download the "Current" folder and move all the scripts to the appropriate locations to expect a functional robot.
#### PHP:
- [html/**index.php**](current/html/index.php): The default interface page containing the structure of the page and some JavaScript.
- [html/**controlscript.php**](current/html/controlscript.php): JavaScript file that listens to keystrokes and sends a movement type and speed to the websocket server run by movement.py. The PHP file extension lets the server pass the IP.
- [html/**downloadsnapshot.php**](current/html/downloadsnapshot.php): PHP file that allows for the download of a camera image outside the web directory
- [html/**performance.php**](current/html/performance.php): Displayed in index.php via an iFrame. Updates with system resource info. Needs to be redone using WebSockets.
- [html/**rawdata.php**](current/html/rawdata.php): Short script receives data from a WebSocket and appends it to a scroller div in index.php
- [html/**restart.php**](current/html/restart.php): Body of the restart program
- [html/**restartscript.php**](current/html/restartscript.php): Script that runs the restart
- [html/**shutdown.php**](current/html/shutdown.php): Body of the shutdown program
- [html/**shutdownscript.php**](current/html/shutdownscript.php): Script that runs the shutdown
#### CSS:
#### Python:
- [python/**movement.py**](current/python/movement.py): This script controls the movement of the robot. It has 3 dependancies: pyax12, asyncio and websockets.
#### Arduino:
-Libraries:
-Sensor IR: https://github.com/guillaume-rico/SharpIR
-Compass: https://github.com/adafruit/Adafruit_LSM303DLHC
-Adafruit Sensor Library: https://github.com/adafruit/Adafruit_Sensor
-Temp Sensor: https://github.com/adafruit/Adafruit-MLX90614-Library

## Testing
**Testing** contains old code or test scripts that for whatever reason still need to be used.
#### HTML:
- [html/**websockettest.html**](testing/html/websockettest.html): Companion HTML file for websockettest.py. Testing script for the websocket.
#### Python:
- [python/tests/**websockettest.py**](testing/python/tests/websockettest.py): Companion Python file for websockettest.py. Testing script for the websocket.

## Retired
**Retired** contains code that is not used in the current project but may need to be referred to.
