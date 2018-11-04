/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
	Mainly based off https://github.com/luser/gamepadtest created in 2013 by Ted Mielczarek (released as CC0)
	Current code borrows some constants from Dan Cox (videlais) https://gist.github.com/videlais/8110000
	
*/

var ip = "10.0.2.4";//window.location.hostname;

var haveEvents = "GamepadEvent" in window;
var haveWebkitEvents = "WebKitGamepadEvent" in window;
var rAF =
	window.mozRequestAnimationFrame ||
	window.requestAnimationFrame;
	
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

var select_pressed = false;
var lastKey = 0;

var message = {
	left_axis_x : 0,
	left_axis_y : 0,
	last_dpad: 'none',
	button_LS : false,
	button_A : false,
	button_B : false,
	button_X : false,
	button_Y : false,
	left_trigger : 0,
	right_trigger : 0,
	left_bumper : false,
	right_bumper : false,
	flipped : false
}

console.log("Attempting to connect to the websocket server");
var controlSocket = new WebSocket("ws://" + ip + ":5555");

//Log to the console the result of the socket connection attempt. Useful for troubleshooting.
function socketState() {
	var state = controlSocket.readyState
	switch (state) {
		case 0:
			return "Connecting (The connection is not yet open)";
		case 1:
			return "Open (The connection is open and ready to communicate)";
		case 2:
			return "Closing (The connection is in the process of closing)";
		case 3:
			return "Closed (The connection is closed or couldn't be opened)";
	}
}
console.log("Attempt result: " + socketState());

/*function updateStatus() {
	// Basic implementation of a button as a toggle
	if (getButton(controller, "SELECT")) {
		select_pressed = true;
	} else if (select_pressed == true) {
		select_pressed = false;
		message.flipped = !message.flipped;

		// Handle flipping
		if (message.flipped) {
			document.getElementById("camera_front").style = "transform: scale(-1, -1);";
			document.getElementById("camera_left").style = "transform: scale(-1, -1);";
			document.getElementById("camera_right").style = "transform: scale(-1, -1);";
			document.getElementById("camera_back").style = "transform: scale(-1, -1);";
			// Swap left and right
			document.getElementById("camera_left").src = "http://" + ip + ":8082";
			document.getElementById("camera_right").src = "http://" + ip + ":8083";
			
		} else {
			document.getElementById("camera_front").style = "";
			document.getElementById("camera_left").style = "";
			document.getElementById("camera_right").style = "";
			document.getElementById("camera_back").style = "";
			// Swap left and right
			document.getElementById("camera_left").src = "http://" + ip + ":8083";
			document.getElementById("camera_right").src = "http://" + ip + ":8082";
		}
	}
	
	message.button_A = getButton(controller, "FACE_0");
	message.button_B = getButton(controller, "FACE_1");
	message.button_X = getButton(controller, "FACE_2");
	message.button_Y = getButton(controller, "FACE_3");
	
	message.button_LS = getButton(controller, "LEFT_STICK");
	
	message.left_bumper = getButton(controller, "LEFT_BUMPER");
	message.right_bumper = getButton(controller, "RIGHT_BUMPER");
	
	message.left_trigger = getTrigger(controller, "LEFT_TRIGGER");
	message.right_trigger = getTrigger(controller, "RIGHT_TRIGGER");

	for (var i = 0; i < controller.axes.length; i++) {
		if (i == 0) message.left_axis_x = controller.axes[i].toFixed(1);
		if (i == 1) message.left_axis_y = controller.axes[i].toFixed(1);
	}
	//console.log(JSON.stringify(message));
	if (controlSocket.readyState == 1) 
		controlSocket.send(JSON.stringify(message));
	
	rAF(updateStatus);
}
*/

function onKeyDown(event) {
	//console.log("(Key Down) Socket Status: " + socketState());
	var key = event.keyCode;
	
	if (lastKey == key) {
		return;
	}
	lastKey = key;
	
	switch (key) {
		/*case 49: //1
			message.speed = 1;
			break;
		case 50: //2
			message.speed = 2;
			break;
		case 51: //3
			speed = 3;
			break;
		case 52: //4
			speed = 4;
			break;
		case 53: //5
			speed = 5;
			break;
		case 54: //6
			speed = 6;
			break;
		case 55: //7
			speed = 7;
			break;
		case 56: //8
			speed = 8;
			break;
		case 57: //9
			speed = 9;
			break;
		case 48: //0
			speed = 10;
			break;*/
		case 87: //W (Forwards)
			message.left_axis_x = 0;
			message.left_axis_y = 1;
			break;
		case 65: //A (Left)
			message.left_axis_x = 1;
			message.left_axis_y = 0;
			break;
		case 83: //S (Reverse)
			message.left_axis_x = 0;
			message.left_axis_y = -1;
			break;
		case 68: //D (Right)
			message.left_axis_x = -1;
			message.left_axis_y = 0;
			break;
		case 70: //F (Flip Controls)
			message.flipped = !message.flipped;
			// Handle flipping
			if (message.flipped) {
				document.getElementById("camera_front").style = "transform: scale(-1, -1);";
				document.getElementById("camera_left").style = "transform: scale(-1, -1);";
				document.getElementById("camera_right").style = "transform: scale(-1, -1);";
				document.getElementById("camera_back").style = "transform: scale(-1, -1);";
				// Swap left and right
				document.getElementById("camera_left").src = "http://" + ip + ":8082";
				document.getElementById("camera_right").src = "http://" + ip + ":8083";
				
			} else {
				document.getElementById("camera_front").style = "";
				document.getElementById("camera_left").style = "";
				document.getElementById("camera_right").style = "";
				document.getElementById("camera_back").style = "";
				// Swap left and right
				document.getElementById("camera_left").src = "http://" + ip + ":8083";
				document.getElementById("camera_right").src = "http://" + ip + ":8082";
			}
			break;
	}
	if (controlSocket.readyState == 1) 
		controlSocket.send(JSON.stringify(message));
}

function onKeyUp(event) {
	var key = event.keyCode;
	if(key == 87 || key == 65 || key == 83 || key == 68 || key == 70 || key == 73 || key == 79 || key == 74 || key == 75 || key == 85) {
		message.left_axis_x = 0;
		message.left_axis_y = 0;
		lastKey = 0;
	}
	if (controlSocket.readyState == 1) 
		controlSocket.send(JSON.stringify(message));
}


//rAF(updateStatus);
