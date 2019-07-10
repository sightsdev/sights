/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
	Mainly based off https://github.com/luser/gamepadtest created in 2013 by Ted Mielczarek (released as CC0)
	
*/

// WebSocket used for controller data
var controlSocket;

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
	//console.log(data);
	if (controlSocket != undefined && controlSocket.readyState == 1) 
		controlSocket.send(JSON.stringify(data));
}

function logControl (control, value) {
	$('#gamepad-log-pre').append("<li>" + new Date().toLocaleTimeString() + " - " + control + " " + value + "</li>" );
}

$(document).ready(function() {
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
	var currentGamepad = 0;
	
	$('#gamepadSelect').on('change', function (e) {
		//var device = gamepad.gamepads[this.value];
		currentGamepad = this.value;
		//$('#gamepad-monitor-pre').html(JSON.stringify(device.state, null, "\t"));
	});

	gamepad.bind(Gamepad.Event.CONNECTED, function(device) {
		console.log('Controller connected:', device.id);
		
		$("#controller-status-connected").show();
		$("#controller-status-disconnected").hide();
		
		bootoast.toast({
			"message": "Controller connected",
			"type": "success",
			"position": "left-bottom"
		});
		
		$('#gamepadSelect').append('<option value="' + device.index + '" id="gamepad-' + device.index + '">' + device.id.replace(/ *\([^)]*\) */g, "") +'</option>');
		$('#gamepadSelect').trigger('change');
	});

	gamepad.bind(Gamepad.Event.DISCONNECTED, function(device) {
		console.log('Controller disconnected', device.id);
		
		$('#gamepad-' + device.index).remove();
		
		if (gamepad.count() == 0) {
			$("#controller-status-connected").hide();
			$("#controller-status-disconnected").show();
		}
		bootoast.toast({
			"message": "Controller disconnected",
			"type": "danger",
			"position": "left-bottom"
		});
	});

	gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
		if (e.gamepad.index == currentGamepad) {
			var c_event = {
				control: e.control, 
				state: "DOWN"
			};
			safeSend(c_event);
			logControl(e.control, "DOWN");
		}
	});

	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
		if (e.gamepad.index == currentGamepad) {
			var c_event = {
				control: e.control, 
				state: "UP"
			};
			safeSend(c_event);
			logControl(e.control, "UP");
		}
	});

	gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
		if (e.gamepad.index == currentGamepad)
			if (e.value.toFixed(2) > 0.3 || e.value.toFixed(2) < -0.3) {
				var c_event = {
					control: e.axis, 
					state: e.value.toFixed(2)
				};
				safeSend(c_event);
				logControl(e.axis, "changed to " + e.value);
			}
	});
	
	gamepad.bind(Gamepad.Event.TICK, function(gamepads) {
		var gamepad = gamepads[currentGamepad];
		if (gamepad)
			$("#gamepad-monitor-pre").html(hljs.highlight("JSON", JSON.stringify(gamepad.state, null, "\t")).value);
	});

	if (!gamepad.init()) {
		alert('Your browser does not support gamepads, get the latest Google Chrome or Firefox.');
	}
});
