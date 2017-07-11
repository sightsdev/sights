# SARTRobot
The scripts and programs written by the SFXRescue team for the SART v.2 rescue robot.
## Current
**Current** contains the code that is run on the robot. One should be able to simply download the "Current" folder and move all the scripts to the appropriate locations to expect a functional robot.
### PHP:
- [html/**index.php**](html/index.php): The default interface page containing the structure of the page and some JavaScript.
### JavaScript:
- [html/**controlscript.php**](html/controlscript.php): JavaScript file that listens to keystrokes and sends a movement type and speed to the websocket server run by movement.py. The PHP file extension lets the server pass the IP, but the rest of the file is JavaScript.
### CSS:
### Python:
- [python/actual scripts/**movement.py**](python/actual%20scripts/movement.py): This script controls the movement of the robot. It has 3 dependancies: pyax12, asyncio and websockets.
- [python/actual scripts/**movementv1.py**](ython/actual%20scripts/movementv1.py): This script is an old version of the movement script. Same dependancies.
 ### Arduino:

## Testing
**Testing** contains old code or test scripts that for whatever reason still need to be used.
### HTML:
- [html/**websockettest.html**](html/websockettest.html): Companion HTML file for websockettest.py. Testing script for the websocket.
### Python:
- [python/tests/**websockettest.py**](python/tests/websockettest.py): Companion Python file for websockettest.py. Testing script for the websocket.

## Retired
**Retired** contains code that is not used in the current project but may need to be referred to.
