/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
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

// Checks if socket is open, then converts data to JSON and sends it
function safeSend(data) {
	logControl(data);
	if (controlSocket != undefined && controlSocket.readyState == 1)
		controlSocket.send(JSON.stringify(data));
}

// Log control to log modal
function logControl(e) {
	value = ('value' in e) ? e["value"] : "MESSAGE SENT"
	$('#gamepad_log_pre').prepend("<li>" + new Date().toLocaleTimeString() + " - " + e['type'] + " " + e['control'] + " " + value + "</li>");
}

// Runs every tick to check changed axes and send values as required
function axisUpdate(currGamepad, ctrl) {
	// Current value of specified control, to 1dp
	var val = currGamepad.state[ctrl].toFixed(1)
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

// Create 'KEYBOARD' event bind that is sent to robot
function createKeyBind(keys, ctrl, func) {
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
			if (func !== undefined) {
				// optional function was passed
				func();
			}
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

function controlConnection() {
	// Create WebSocket
	controlSocket = new WebSocket("ws://" + ip + ":5555");

	controlSocket.onclose = function (event) {
		setTimeout(function(){controlConnection()},5000);
		console.log("Attempting control connection");
	};

	controlSocket.onopen = function (event) {
		console.log("Connected control");
	}
}

$(document).ready(function () {
	controlConnection();

	// Hide 'Controller Connected' indicator, until connected 
	$("#controller_status_connected").hide();

	// Attach it to the window so it can be inspected at the console.
	window.gamepad = new Gamepad();

	// When the user changes the active gamepad using the dropdown box
	$('#gamepad_select').on('change', function (e) {
		currentGamepad = this.value;
	});

	gamepad.bind(Gamepad.Event.CONNECTED, function (device) {
		console.log('Controller connected:', device.id);

		$("#controller_status_connected").show();
		$("#controller_status_disconnected").hide();

		bootoast.toast({
			"message": "Controller connected",
			"type": "success",
			"icon": "gamepad",
			"position": "left-bottom"
		});

		$('#gamepad_select').append('<option value="' + device.index + '" id="gamepad-' + device.index + '">' + device.id.replace(/ *\([^)]*\) */g, "") + '</option>');
		$('#gamepad_select').val(device.index);
		$('#gamepad_select').trigger('change');
	});

	gamepad.bind(Gamepad.Event.DISCONNECTED, function (device) {
		console.log('Controller disconnected', device.id);

		$('#gamepad-' + device.index).remove();

		if (gamepad.count() == 0) {
			$("#controller_status_connected").hide();
			$("#controller_status_disconnected").show();
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
				// These are really axes, but can act as buttons, which we don't need
				return;
			}
			if (e.control == "SELECT_BACK") {
				// Toggle sensor / camera mode
				toggleSensorMode();
				// Select button is *not* passed to the client
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
				// These are really axes, but can act as buttons, which we don't need
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
				// We handle these seperately, since this wasn't providing the required performance
				return;
			}
			// Current value of specified control, to 1dp
			var val = e.value.toFixed(1);
			// Deadzone threshold
			if (val > -0.2 && val < 0.2) val = 0;
			// Compare against last
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

	gamepad.bind(Gamepad.Event.TICK, function (gamepads) {
		var gamepad = gamepads[currentGamepad];
		if (gamepad) {
			$("#gamepad_monitor_pre").html(hljs.highlight("JSON", JSON.stringify(gamepad.state, null, "\t")).value);

			// Check axis state at every tick since event binding doesn't catch all changes
			axisUpdate(gamepad, "LEFT_BOTTOM_SHOULDER");
			axisUpdate(gamepad, "RIGHT_BOTTOM_SHOULDER");
		}
	});

	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, please update to a modern web browser');
	}

	// Create keyboard bindings
	createKeyBind(['w', 'up'], "FORWARD");
	createKeyBind(['a', 'left'], "LEFT");
	createKeyBind(['s', 'down'], "BACKWARDS");
	createKeyBind(['d', 'right'], "RIGHT");
	createKeyBind(['+', '='], "SPEED_UP");
	createKeyBind(['-', '_'], "SPEED_DOWN");
	// Disable keyboard controls when modal is open
	$(".modal").on('shown.bs.modal', function () {
		keyboardJS.pause();
	});
	$(".modal").on('hidden.bs.modal', function () {
		keyboardJS.resume();
	});
	// Allow toggling of camera / sensor mode via keyboard
	keyboardJS.bind('1', null, function (e) {
		if (sensorMode)
			toggleSensorMode();
	});
	keyboardJS.bind('2', null, function (e) {
		if (!sensorMode)
			toggleSensorMode();
	});

	// Handle shutdown and reboot buttons
	$("#shutdown_button").click(function () {
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
	$("#reboot_button").click(function () {
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
	$("#config_editor_save_button").click(function () {
		// Get contents of config editor
		var contents = $("#config_editor_pre")[0].innerText
		try {
			// Parse from YAML into JS
			var yml = jsyaml.safeLoad(contents);
			// And then turn that into a JSON string
			var val = JSON.stringify(yml, null, '\t');
			// Create message event
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
		} catch (e) {
			bootoast.toast({
				"message": "Could not validate config file",
				"type": "danger",
				"icon": "file-alt",
				"position": "left-bottom"
			});
		}

	});
	$("#config_editor_reload_button").click(function () {
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

	// Script control buttons
	$("#restart_scripts_button").click(function () {
		var c_event = {
			type: "SYSTEM",
			control: "RESTART_SCRIPTS"
		};
		safeSend(c_event);
		bootoast.toast({
			"message": "Requested a script restart. Refresh the page",
			"type": "info",
			"icon": "terminal",
			"position": "left-bottom"
		});
	});
	$("#kill_scripts_button").click(function () {
		var c_event = {
			type: "SYSTEM",
			control: "KILL_SCRIPTS"
		};
		safeSend(c_event);
		bootoast.toast({
			"message": "All scripts will be t̵͔̞e̷̦̜r̝̝m̰̱̠̕inḁ̱̕te̪̕ḍ͕. Goodbye.",
			"type": "danger",
			"icon": "skull",
			"position": "left-bottom"
		});
	});
});