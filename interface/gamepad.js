/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
	Mainly based off https://github.com/luser/gamepadtest created in 2013 by Ted Mielczarek (released as CC0)
	Current code borrows some constants from Dan Cox (videlais) https://gist.github.com/videlais/8110000
	
*/

var ip = "10.0.2.4";//window.location.hostname;

var haveEvents = "GamepadEvent" in window;
var haveWebkitEvents = "WebKitGamepadEvent" in window;
var controllers = {};
var rAF =
	window.mozRequestAnimationFrame ||
	window.requestAnimationFrame;
	
var BUTTONS = {
	FACE_0: 0,
	FACE_1: 1,
	FACE_2: 2,
	FACE_3: 3,
	LEFT_SHOULDER: 4,
	RIGHT_SHOULDER: 5,
	LEFT_SHOULDER_BOTTOM: 6,
	RIGHT_SHOULDER_BOTTOM: 7,
	SELECT: 8,
	START: 9,
	LEFT_ANALOGUE_STICK: 10,
	RIGHT_ANALOGUE_STICK: 11,
	PAD_UP: 12,
	PAD_DOWN: 13,
	PAD_LEFT: 14,
	PAD_RIGHT: 15,
	CENTER_BUTTON: 16
};

var message = {
	left_axis_x : 0,
	left_axis_y : 0,
	focused_camera : 'front'
	//TODO: Add other relevant data
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

function connectHandler(e) {
	addGamepad(e.gamepad);
}

function addGamepad(gamepad) {
	document.getElementById("start").style.display = "none";
	controllers[gamepad.index] = gamepad;
	rAF(updateStatus);
	console.log("Controller connected");
}

function disconnectHandler(e) {
	removeGamepad(e.gamepad);
}

function removeGamepad(gamepad) {
	var d = document.getElementById("controller" + gamepad.index);
	document.body.removeChild(d);
	delete controllers[gamepad.index];
}

function updateStatus() {
	scanGamepads();
	
	for (j in controllers) {
		var controller = controllers[j];
		
		for (var i = 0; i < controller.buttons.length; i++) {
			var val = controller.buttons[i];
			var pressed = val == 1.0;
			if (typeof val == "object") {
				pressed = val.pressed;
				val = val.value;
			}
			if (pressed) {
				if (i == BUTTONS["PAD_UP"])
					message.focused_camera = "front";
				else if (i == BUTTONS["PAD_LEFT"])
					message.focused_camera = "left";
				else if (i == BUTTONS["PAD_DOWN"])
					message.focused_camera = "down";
				else if (i == BUTTONS["PAD_RIGHT"])
					message.focused_camera = "right";
			}
		}

		for (var i = 0; i < controller.axes.length; i++) {
			if (i == 0) message.left_axis_x = controller.axes[i].toFixed(4);
			if (i == 1) message.left_axis_y = controller.axes[i].toFixed(4);
		}
	}
	//console.log(JSON.stringify(message));
	controlSocket.send(JSON.stringify(message));
	
	rAF(updateStatus);
}

function scanGamepads() {
	var gamepads = navigator.getGamepads
		? navigator.getGamepads()
		: navigator.webkitGetGamepads
			? navigator.webkitGetGamepads()
			: [];
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i]) {
			if (!(gamepads[i].index in controllers)) {
				addGamepad(gamepads[i]);
			} else {
				controllers[gamepads[i].index] = gamepads[i];
			}
		}
	}
}

if (haveEvents) {
	window.addEventListener("gamepadconnected", connectHandler);
	window.addEventListener("gamepaddisconnected", disconnectHandler);
} else if (haveWebkitEvents) {
	window.addEventListener("webkitgamepadconnected", connectHandler);
	window.addEventListener("webkitgamepaddisconnected", disconnectHandler);
} else {
	setInterval(scanGamepads, 500);
}
