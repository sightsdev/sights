/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
*/

// WebSocket used for controller data
var controlSocket;
var currentGamepad = 0;
var last_axis_state = {
	"RIGHT_BOTTOM_SHOULDER": 0.0,
	"LEFT_BOTTOM_SHOULDER": 0.0,
	"LEFT_STICK_X": 0.0,
	"LEFT_STICK_Y": 0.0,
	"RIGHT_STICK_X": 0.0,
	"RIGHT_STICK_Y": 0.0
}

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

// Checks if socket is open, then converts data to JSON and sends it
function safeSend(data) {
	logControl(data);
	if (controlSocket != undefined && controlSocket.readyState == 1)
		controlSocket.send(JSON.stringify(data));
}

function logControl(e) {

	value = ('value' in e) ? e["value"] : "MESSAGE SENT"

	$('#gamepad-log-pre').prepend("<li>" + new Date().toLocaleTimeString() + " - " + e['type'] + " " + e['control'] + " " + value + "</li>");
}

function createKeyBind(keys, ctrl) {
	// Create keyboard bindings using KeyboardJS
	keys.forEach(function (key) {
		keyboardJS.bind(key, function (e) {
			// Key down event
			e.preventRepeat();
			var c_event = {
				type: "KEYBOARD",
				control: ctrl,
				value: "DOWN"
			};
			safeSend(c_event);
		}, function (e) {
			// Key up event
			var c_event = {
				type: "KEYBOARD",
				control: ctrl,
				value: "UP"
			};
			safeSend(c_event);
		});
	});
}

function set_speed_indicator(speed) {
	
	//$("#gp_speed_node_1")
}

$(document).ready(function () {
	$("#controller-status-connected").hide();

	console.log("Attempting to connect to the websocket server");

	try {
		controlSocket = new WebSocket("ws://" + ip + ":5555");
		console.log("Attempt result: " + socketState());
	} catch (err) {
		console.log("Not connected to controller socket");
	}

	// Attach it to the window so it can be inspected at the console.
	window.gamepad = new Gamepad();

	$('#gamepadSelect').on('change', function (e) {
		//var device = gamepad.gamepads[this.value];
		currentGamepad = this.value;
		//$('#gamepad-monitor-pre').html(JSON.stringify(device.state, null, "\t"));
	});

	// Create keyboard bindings
	createKeyBind(['w', 'up'], "FORWARD");
	createKeyBind(['a', 'left'], "LEFT");
	createKeyBind(['s', 'down'], "BACKWARDS");
	createKeyBind(['d', 'right'], "RIGHT");
	createKeyBind(['+', '='], "SPEED_UP");
	createKeyBind(['-', '_'], "SPEED_DOWN");

	// Handle shutdown and reboot buttons
	$("#shutdownButton").click(function () {
		var c_event = {
			type: "SYSTEM",
			control: "SHUTDOWN"
		};
		safeSend(c_event);
		bootoast.toast({
			"message": "Shutting down",
			"type": "warning",
			"icon": "power-off",
			"position": "left-bottom"
		});
	});
	$("#rebootButton").click(function () {
		var c_event = {
			type: "SYSTEM",
			control: "REBOOT"
		};
		safeSend(c_event);
		bootoast.toast({
			"message": "Rebooting",
			"type": "warning",
			"icon": "undo",
			"position": "left-bottom"
		});
	});

	// Config editor button actions
	$("#config-editor-save-button").click(function () {
		// Get contents of config editor
		var contents = $("#config-editor-pre").text();
		// Convert from YAML to js object
		// And then to a JSON string
		var val = JSON.stringify(jsyaml.safeLoad(contents), null, '\t');

		var c_event = {
			type: "SYSTEM",
			control: "UPDATE_CONFIG",
			value: val
		};
		safeSend(c_event);
		bootoast.toast({
			"message": "Sent config file",
			"type": "success",
			"icon": "file-alt",
			"position": "left-bottom"
		});
	});
	$("#config-editor-reload-button").click(function () {
		var c_event = {
			type: "SYSTEM",
			control: "REQUEST_CONFIG"
		};
		safeSend(c_event);
		bootoast.toast({
			"message": "Requested config file",
			"type": "info",
			"icon": "file-alt",
			"position": "left-bottom"
		});
	});


	gamepad.bind(Gamepad.Event.CONNECTED, function (device) {
		console.log('Controller connected:', device.id);

		$("#controller-status-connected").show();
		$("#controller-status-disconnected").hide();

		bootoast.toast({
			"message": "Controller connected",
			"type": "success",
			"icon": "gamepad",
			"position": "left-bottom"
		});

		$('#gamepadSelect').append('<option value="' + device.index + '" id="gamepad-' + device.index + '">' + device.id.replace(/ *\([^)]*\) */g, "") + '</option>');
		$('#gamepadSelect').val(device.index);
		$('#gamepadSelect').trigger('change');
	});

	gamepad.bind(Gamepad.Event.DISCONNECTED, function (device) {
		console.log('Controller disconnected', device.id);

		$('#gamepad-' + device.index).remove();

		if (gamepad.count() == 0) {
			$("#controller-status-connected").hide();
			$("#controller-status-disconnected").show();
		}
		bootoast.toast({
			"message": "Controller disconnected",
			"type": "danger",
			"icon": "gamepad",
			"position": "left-bottom"
		});
	});

	gamepad.bind(Gamepad.Event.BUTTON_DOWN, function (e) {
		if (e.gamepad.index == currentGamepad) {
			if (e.control == "RIGHT_BOTTOM_SHOULDER" || e.control == "LEFT_BOTTOM_SHOULDER") {
				return;
			}
			var c_event = {
				type: "BUTTON",
				control: e.control,
				value: "DOWN"
			};
			safeSend(c_event);
		}
	});

	gamepad.bind(Gamepad.Event.BUTTON_UP, function (e) {
		if (e.gamepad.index == currentGamepad) {
			if (e.control == "RIGHT_BOTTOM_SHOULDER" || e.control == "LEFT_BOTTOM_SHOULDER") {
				return;
			}
			var c_event = {
				type: "BUTTON",
				control: e.control,
				value: "UP"
			};
			safeSend(c_event);
		}
	});

	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function (e) {
		if (e.gamepad.index == currentGamepad) {
			if (e.axis == "RIGHT_BOTTOM_SHOULDER" || e.axis == "LEFT_BOTTOM_SHOULDER") {
				return;
			}

			var val = e.value.toFixed(2);
			if (val > -0.3 && val < 0.3) val = 0.0;

			if (val != last_axis_state[e.axis]) {
				// Update last value with current value
				last_axis_state[e.axis] = val;			
				var c_event = {
					type: "AXIS",
					control: e.axis,
					value: val
				};
				safeSend(c_event);
			}
		}
	});

	function axisUpdate(currGamepad, ctrl) {
		// Current value of specified control, to 2dp
		var val = currGamepad.state[ctrl].toFixed(2)
		// Compare against last value
		if (val != last_axis_state[ctrl]) {
			// Update last value with current value
			last_axis_state[ctrl] = val;
			// Create event message
			var c_event = {
				type: "AXIS",
				control: ctrl,
				value: val
			};
			// Send event message
			safeSend(c_event);
		}
	}

	gamepad.bind(Gamepad.Event.TICK, function (gamepads) {
		var gamepad = gamepads[currentGamepad];
		if (gamepad) {
			$("#gamepad-monitor-pre").html(hljs.highlight("JSON", JSON.stringify(gamepad.state, null, "\t")).value);

			// Check axis state at every tick since event binding doesn't catch all changes
			axisUpdate(gamepad, "LEFT_BOTTOM_SHOULDER");
			axisUpdate(gamepad, "RIGHT_BOTTOM_SHOULDER");
		}
	});

	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
});