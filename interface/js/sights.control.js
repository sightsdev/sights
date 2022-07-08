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
	let value = ('value' in e) ? e["value"] : "MESSAGE SENT";
	$('#input_log_pre').prepend("<li>" + new Date().toLocaleTimeString() + " - " + e['type'] + " " + e['control'] + " " + value + "</li>");
}

// Runs every tick to check changed axes and send values as required
function axisUpdate(currGamepad, ctrl) {
	// Current value of specified control, to 1dp
	let val = currGamepad.state[ctrl].toFixed(1);
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
function createFunctionKeyBind(keys, ctrl, func) {
	// Create keyboard bindings using KeyboardJS
	let c_event = {
				type: "KEYBOARD",
				control: ctrl
			};
	keys.forEach(function (key) {
		keyboardJS.bind(key, function () {
			// Key down event
			c_event["value"] = "DOWN";
			safeSend(c_event);
			if (func !== undefined) {
				// optional function was passed
				func();
			}
		}, function () {
			// Key up event
			c_event["value"] = "UP";
			safeSend(c_event);
		});
	});
}

let movementKeysPressed = [];
function sendMovementKeys() {
	let c_event = {type: "KEYBOARD", control: "STOP"};
	safeSend(c_event);
	if (movementKeysPressed.length) {
		c_event["control"] = movementKeysPressed[0];
		safeSend(c_event)
	}
	/* // For future motor rewrite (motor handler ignores when motors are not independent)
	let c_event = {type: "KEYBOARD", value: "STOP"};
	(movementKeysPressed.length) ? c_event["control"] = movementKeysPressed[0] : c_event["control"] = "STOP";
	console.log(c_event);
	safeSend(c_event);
	*/
}

// Create 'KEYBOARD' event bind that is sent to robot
function createMovementKeyBind(keys, ctrl) {
	// Create keyboard bindings using KeyboardJS
	keys.forEach(function (key) {
		keyboardJS.bind(key, function (e) {
			// Key down event
			e.preventRepeat();
			movementKeysPressed.unshift(ctrl);
			sendMovementKeys();
		}, function () {
			// Key up event
			movementKeysPressed.splice(movementKeysPressed.findIndex(e => e == ctrl), 1);
			sendMovementKeys();
		});
	});
}

function controlConnection() {
	if(!demo) {
		// Create WebSocket
		controlSocket = new WebSocket("ws://" + ip + ":5555");
		controlSocket.onopen = function () {
			controlConnected = true;
			controlConnectedAlert();
		};

		controlSocket.onclose = function () {
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
	$('#gamepad_select').on('change', function () {
		currentGamepad = this.value;
	});

	gamepad.bind(Gamepad.Event.CONNECTED, function (device) {
		interfaceLog("info", "controller", "Connected: " + device.id);
		gamepadConnectedAlert();

		$('#gamepad_select').append('<option value="' + device.index + '" id="gamepad-' + device.index + '">' + device.id.replace(/ *\([^)]*\) */g, "") + '</option>');
		$('#gamepad_select').val(device.index);
		$('#gamepad_select').trigger('change');
	});

	gamepad.bind(Gamepad.Event.DISCONNECTED, function (device) {
		interfaceLog("info", "controller", "Disconnected: " + device.id);

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
				// We handle these separately, since this wasn't providing the required performance
				return;
			}
			// Current value of specified control, to 1dp
			let val = e.value.toFixed(1);
			// Deadzone threshold
			if (val > -0.2 && val < 0.2) val = 0;
			// Compare against last
			if (val != last_axis_state[e.axis]) {
				// Update last value with current value
				last_axis_state[e.axis] = val;
				let c_event = {
					type: "AXIS",
					control: e.axis,
					value: val
				};
				safeSend(c_event);
			}
		}
	});

	gamepad.bind(Gamepad.Event.TICK, function (gamepads) {
		let gamepad = gamepads[currentGamepad];
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
	// These keyboard commands should only be active in the main robot control view (not modals)
	keyboardJS.setContext('main');

	// Open terminal modal
	keyboardJS.bind('alt+t', (e) => {
		e.preventDefault();
		$('#ssh_modal').modal();
	});

	// Open settings modal
	keyboardJS.bind('alt+s', (e) => {
		e.preventDefault();
		$('#settings_modal').modal();
	});

	// Open log modal
	keyboardJS.bind('alt+l', (e) => {
		e.preventDefault();
		$('#log_modal').modal();
	});

	// Open documentation tab
	keyboardJS.bind('alt+d', (e) => {
		e.preventDefault();
		$("#docs_button").click()
	});

	// Create keyboard bindings
	createMovementKeyBind(['w', 'up'], "FORWARD");
	createMovementKeyBind(['a', 'left'], "LEFT");
	createMovementKeyBind(['s', 'down'], "BACKWARDS");
	createMovementKeyBind(['d', 'right'], "RIGHT");
	createFunctionKeyBind(['+', '='], "SPEED_UP");
	createFunctionKeyBind(['-', '_'], "SPEED_DOWN");

	createFunctionKeyBind(['num0'], "NUM0");
	createFunctionKeyBind(['num1'], "NUM1");
	createFunctionKeyBind(['num2'], "NUM2");
	createFunctionKeyBind(['num3'], "NUM3");
	createFunctionKeyBind(['num4'], "NUM4");
	createFunctionKeyBind(['num5'], "NUM5");
	createFunctionKeyBind(['num6'], "NUM6");
	createFunctionKeyBind(['num7'], "NUM7");
	createFunctionKeyBind(['num8'], "NUM8");
	createFunctionKeyBind(['num9'], "NUM9");
	createFunctionKeyBind(['num.'], "NUM.");
	createFunctionKeyBind(['num-'], "NUM-");
	createFunctionKeyBind(['numadd'], "NUM+");
	createFunctionKeyBind(['num/'], "NUM/");
	createFunctionKeyBind(['num*'], "NUM*");
	
	// Disable keyboard controls when modal is open
	$(".modal").on('shown.bs.modal', function () {
		keyboardJS.setContext(this.id);
	});
	$(".modal").on('hidden.bs.modal', function () {
		keyboardJS.setContext('main');
	});
	// Allow toggling of camera / sensor mode via keyboard
	keyboardJS.bind('1', null, function () {
		if (sensorMode)
			toggleSensorMode();
	});
	keyboardJS.bind('2', null, function () {
		if (!sensorMode)
			toggleSensorMode();
	});

	// Setup CTRL-S for settings modal
	keyboardJS.withContext('settings_modal', function() {
		keyboardJS.bind('ctrl+s', function(e) {
			e.preventDefault();
			saveConfig();
		});
	});

	// Advanced config editor button actions
	$(".editor_save_button").on("click", function () {
		saveConfig();
    });

	$(".editor_reload_button").on("click", function () {
		configRequestedAlert();
		if(!$(".editor_reload_button").hasClass("disabled")) {
            requestConfig(function (response) {
                applyConfig(response);
            });
		}
	});
});
