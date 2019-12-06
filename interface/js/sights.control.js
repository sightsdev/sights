/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

// WebSocket used for controller data
var controlSocket;
var controlConnected = false;
var currentGamepad = 0;
var last_axis_state = {
	"RIGHT_BOTTOM_SHOULDER": 0.0,
	"LEFT_BOTTOM_SHOULDER": 0.0,
	"LEFT_STICK_X": 0.0,
	"LEFT_STICK_Y": 0.0,
	"RIGHT_STICK_X": 0.0,
	"RIGHT_STICK_Y": 0.0
};

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
	if(!demo) {
		// Create WebSocket
		controlSocket = new WebSocket("ws://" + ip + ":5555");
		controlSocket.onopen = function() {
			controlConnected = true;
			controlConnectedAlert();
		};

		controlSocket.onclose = function() {
			if (controlConnected) {
				controlDisconnectedAlert();
				controlConnected = false;
			}
			setTimeout(function () {
				controlConnection()
			}, 1000);
		};
	}
}

$(document).on("ready", function () {
	controlConnection();

	// Hide 'Controller Connected' indicator, until connected 
	$("#controller_status_connected").hide();

	// Attach it to the window so it can be inspected at the console.
	window.gamepad = new Gamepad();

	// When the user changes the active gamepad using the dropdown box
	$('#gamepad_select').on('change', function() {
		currentGamepad = this.value;
	});

	gamepad.bind(Gamepad.Event.CONNECTED, function (device) {
		console.log('Controller connected:', device.id);
		gamepadConnectedAlert();

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
		gamepadDisconnectedAlert();
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
	$("#shutdown_button").on("click", function () {
		if(demo) {
			location.reload();
		}
		else {
			var c_event = {
				type: "SYSTEM",
				control: "SHUTDOWN"
			};
			safeSend(c_event);
		}
		shutdownAlert();
	});
	$("#reboot_button").on("click", function () {
		if(demo) {
			location.reload();
		}
		else {
			var c_event = {
				type: "SYSTEM",
				control: "REBOOT"
			};
			safeSend(c_event);
		}
		rebootAlert();
	});

	// Advanced config editor button actions
	$(".editor_save_button").on("click", function () {
		saveConfig();
    });

	$(".editor_reload_button").on("click", function () {
		if(!$(".editor_reload_button").hasClass("disabled")) {
            requestConfig(function(response) {
                configEditor.setValue(response);
                // Keep a copy to track changes
                baseConfig = JSON.stringify(configEditor.getValue());
                savedConfig = baseConfig;
				// Stringify value of new config to remove key-value pairs with `undefined` value
				var jsonString = JSON.stringify(response);
				// Set advanced editor
				var yaml = jsyaml.safeDump(JSON.parse(jsonString), indent = 4);
				// Populate advanced editor
				$("#advanced_editor_pre").html(hljs.highlight("YAML", yaml).value);
                updateConfigAlerts();
                configReceivedAlert();
            });
			configRequestedAlert();
		}
	});
});