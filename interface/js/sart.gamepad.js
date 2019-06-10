/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
	Mainly based off https://github.com/luser/gamepadtest created in 2013 by Ted Mielczarek (released as CC0)
	Current code borrows some constants from Dan Cox (videlais) https://gist.github.com/videlais/8110000
	
*/

var haveEvents = "GamepadEvent" in window;
var haveWebkitEvents = "WebKitGamepadEvent" in window;
var controllers = {};
var rAF =
	window.mozRequestAnimationFrame ||
	window.requestAnimationFrame;

var select_pressed = false;

var controlSocket;
	
var BUTTONS = {
	FACE_A: 0,
	FACE_B: 1,
	FACE_X: 2,
	FACE_Y: 3,
	LEFT_BUMPER: 4,
	RIGHT_BUMPER: 5,
	LEFT_TRIGGER: 6,
	RIGHT_TRIGGER: 7,
	SELECT: 8,
	START: 9,
	LEFT_STICK: 10,
	RIGHT_STICK: 11,
	PAD_UP: 12,
	PAD_DOWN: 13,
	PAD_LEFT: 14,
	PAD_RIGHT: 15,
	CENTER_BUTTON: 16
};

// Sample message format
var controller_message = {}
/*
	button_A : false,
	button_B : false,
	button_X : false,
	button_Y : false,
	left_bumper : false,
	right_bumper : false,
	left_trigger : 0,
	right_trigger : 0,
	left_axis_x : 0,
	left_axis_y : 0,
	right_axis_x : 0,
	right_axis_y : 0,
	button_select : false,
	button_start : false,
	left_stick : false,
	right_stick : false,
	pad_up: false,
	pad_down: false,
	pad_left: false,
	pad_right: false,
	center: false,
	flipped : false
}
*/

var last_message = JSON.stringify(controller_message);

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

function connectHandler(e) {
	addGamepad(e.gamepad);
}

function addGamepad(gamepad) {
	$("#controller_status").html("<i class='fa fa-fw fa-gamepad'></i>");
	$("#controller_status").attr("class", "btn btn-success");

	bootoast.toast({
		"message": "Controller connected",
		"type": "success",
		"position": "left-bottom"
	});
	
	controllers[gamepad.index] = gamepad;
	rAF(updateStatus);
	console.log("Controller connected");
}

function disconnectHandler(e) {
	removeGamepad(e.gamepad);
}

function removeGamepad(gamepad) {
	$("#controller_status").html("<i class='fa fa-fw fa-gamepad'></i> Press a button to connect");
	$("#controller_status").attr("class", "btn btn-danger");
	bootoast.toast({
		"message": "Controller disconnected",
		"type": "danger",
		"position": "left-bottom"
	});	
	var d = document.getElementById("controller" + gamepad.index);
	document.body.removeChild(d);
	delete controllers[gamepad.index];
}

function getButton(controller, id) {
	var val = controller.buttons[BUTTONS[id]];
	var pressed = val == 1.0;
	if (typeof val == "object") {
		pressed = val.pressed;
		val = val.value;
	}
	if (pressed) {
		return true;
	} else return false;
}

function getTrigger(controller, id) {
	var button = controller.buttons[BUTTONS[id]];
	if (typeof button == "object") {
		return button.value.toFixed(1);
	}
}

function updateStatus() {
	scanGamepads();
	
	for (j in controllers) {
		var controller = controllers[j];
		
		// Basic implementation of a button as a toggle
		if (getButton(controller, "SELECT")) {
			select_pressed = true;
		} else if (select_pressed == true) {
			select_pressed = false;
			controller_message.flipped = !controller_message.flipped;

			// Handle flipping
			if (controller_message.flipped) {
				$("#camera_front").attr("style", "transform: scale(-1, -1);");
				$("#camera_left").attr("style", "transform: scale(-1, -1);");
				$("#camera_right").attr("style", "transform: scale(-1, -1);");
				$("#camera_back").attr("style", "transform: scale(-1, -1);");
				// Swap left and right
				$("#camera_left").attr("src", portString(8082));
				$("#camera_right").attr("src", portString(8083));
				
			} else {
				$("#camera_front").attr("style", "");
				$("#camera_left").attr("style", "");
				$("#camera_right").attr("style", "");
				$("#camera_back").attr("style", "");
				// Swap left and right
				$("#camera_left").attr("src", portString(8083));
				$("#camera_right").attr("src", portString(8082));
			}
		}
		
		controller_message.button_A = getButton(controller, "FACE_A");
		controller_message.button_B = getButton(controller, "FACE_B");
		controller_message.button_X = getButton(controller, "FACE_X");
		controller_message.button_Y = getButton(controller, "FACE_Y");
		
		controller_message.pad_up = getButton(controller, "PAD_UP");
		controller_message.pad_down = getButton(controller, "PAD_DOWN");
		controller_message.pad_left = getButton(controller, "PAD_LEFT");
		controller_message.pad_right = getButton(controller, "PAD_RIGHT");
		
		controller_message.left_stick = getButton(controller, "LEFT_STICK");
		controller_message.right_stick = getButton(controller, "RIGHT_STICK");
		
		controller_message.left_bumper = getButton(controller, "LEFT_BUMPER");
		controller_message.right_bumper = getButton(controller, "RIGHT_BUMPER");
		
		controller_message.left_trigger = getTrigger(controller, "LEFT_TRIGGER");
		controller_message.right_trigger = getTrigger(controller, "RIGHT_TRIGGER");

		for (var i = 0; i < controller.axes.length; i++) {
			if (i == 0) controller_message.left_axis_x = controller.axes[i].toFixed(1);
			if (i == 1) controller_message.left_axis_y = controller.axes[i].toFixed(1);
		}
		
		json_message = JSON.stringify(controller_message);
	
		// Compare with last message
		if (json_message !== last_message) {
			last_message = json_message;
			//console.log(json_message);
			if (controlSocket.readyState == 1) 
				controlSocket.send(json_message);
		}
	}
	
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

$(document).ready(function(){
	console.log("Attempting to connect to the websocket server");
	
	try {
		controlSocket = new WebSocket("ws://" + ip + ":5555");
		console.log("Attempt result: " + socketState());
	} catch (err) {
		console.log(err);
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
});
