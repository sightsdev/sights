/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

// Populate SARTInterface with dummy data to demonstrate what a functional setup looks like
function DemoMode() {
	// CPU temp graph
	$("#cputemp_level").html("45&degC");
	$("#cputemp_graph").attr('class', "c100 med orange center p45");
	// Charge level
	$("#charge_level").html("97%");
	$("#charge_graph").attr('class', "c100 med orange center p97");
	// CO2 level
	$("#co2_level").html("250<span style='font-size: 10px'> ppm</span>");
	$("#co2_graph").attr('class', "c100 med orange center p25");
	// TVOC level
	$("#tvoc_level").html("75<span style='font-size: 10px'> ppb</span>");
	$("#tvoc_graph").attr('class', "c100 med orange center p14");
	// Temperature history graph
	tempChartConfig.data.datasets[0].data = [22, 22, 22, 24, 22, 24, 28, 29, 27, 24, 25, 24, 23, 22, 22];
	tempChart.update();
	// Distance radial graph
	distChartConfig.data.datasets[0].data = [768, 128, 256, 312]; // Four directions
	distChart.update();

	// Camera streams, load dummy images
	$('.streamImage').each(function (index, value) {
		value.src = 'https://picsum.photos/575/430?' + Math.random();
		value.className = "streamImage";
	});

	// SSH modal needs some content
	$(".ssh-container iframe").attr('src', 'https://gitsuppository.net/');	// Set src for currently open terminals

	// Uptime
	$("#uptime").html("4:18:22");
	// Memory
	$("#memory").css('color', getColorForPercentage(0.3))
	$("#memory_used").html(1273);
	$("#memory_total").html(8192);

	// Generate thermal camera table
	var table = $("<table>");
	for (i = 0; i < 24; i++) {
		var row = $('<tr>');
		for (j = 0; j < 32; j++) {
			var offset = i * 32 + j;
			var node = $("<td style='position: relative;'><div class='content' id=p" + offset + "></div></td>");
			row.append(node);
		}
		table.append(row);
	}
	$('#thermal_camera').html(table);
	// Create example pixel grid for thermal camera
	for (i = 0; i < 24; i++) {
		for (j = 0; j < 32; j++) {
			var offset = i * 32 + j;
			var pixel = 20 - i ** j;
			// Also cool:
			//var pixel = 24 + i * j;
			//var pixel = 20 + i ** j;
			$("#p" + offset).css("background", rainbow(pixel));
		}
	}

	// Update sensor monitor (in log modal)
	var obj = {
		distance: [768, 128, 256, 312],
		thermal_camera: [],
		co2: 250,
		tvoc: 75,
		temp: [22],
		charge: 0.97,
		cpu_temp: 45,
	};
	$("#sensor-monitor-pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);

	// Controller status indicator
	$("#controller-status-connected").show();
	$("#controller-status-disconnected").hide();
	// Create corresponding toast
	bootoast.toast({
		"message": "Controller connected",
		"icon": "gamepad",
		"type": "success",
		"position": "left-bottom"
	});
	// Active gamepad dropdown menu
	$('#gamepadSelect').html('<option value="0" id="gamepad">Xbox 360 Controller</option>');

	// Gamepad monitor data
	obj = {
		"FACE_1": 0,
		"FACE_2": 0,
		"FACE_3": 0,
		"FACE_4": 0,
		"LEFT_TOP_SHOULDER": 0,
		"RIGHT_TOP_SHOULDER": 0,
		"LEFT_BOTTOM_SHOULDER": 0,
		"RIGHT_BOTTOM_SHOULDER": 0,
		"SELECT_BACK": 0,
		"START_FORWARD": 0,
		"LEFT_STICK": 0,
		"RIGHT_STICK": 0,
		"DPAD_UP": 0,
		"DPAD_DOWN": 0,
		"DPAD_LEFT": 0,
		"DPAD_RIGHT": 0,
		"HOME": 0,
		"LEFT_STICK_X": 0.11680781841278076,
		"LEFT_STICK_Y": 0,
		"RIGHT_STICK_X": 0,
		"RIGHT_STICK_Y": 0.03492790460586548
	}
	$('#gamepad-monitor-pre').html(hljs.highlight("JSON",JSON.stringify(obj, null, '\t')).value);

	// Config editor box
	obj = {
		"network": {
			"ip": "localhost"
		},
		"control": {
			"default_gamepad_speed": 5,
			"default_keyboard_speed": 5
		},
		"servo": {
			"port": "/dev/ttyACM0",
			"baudrate": 1000000
		},
		"arduino": {
			"enabled": false,
			"port": "/dev/ttyACM1",
			"baudrate": 115200
		},
		"cameras": {
			"front": {
				"enabled": true,
				"port": 8081
			},
			"back": {
				"enabled": true,
				"port": 8082
			},
			"left": {
				"enabled": false,
				"port": 8083
			},
			"right": {
				"enabled": false,
				"port": 8084
			}
		},
		"sensors": {
			"thermal_camera": {
				"enabled": true,
				"width": 32,
				"height": 24
			},
			"temperature": {
				"enabled": true
			},
			"distance_graph": {
				"enabled": true
			}
		},
		"debug": {
			"print_messages": false,
			"use_virtual_servos": true
		}
	}
	var yaml = jsyaml.safeDump(obj, indent = 4);
	$("#config-editor-pre").html(hljs.highlight("YAML", yaml).value);

	// Set robot connection status indicator
	$("#robot_status").html("<i class='fa fa-fw fa-link'></i>");
	$("#robot_status").attr("class", "btn btn-success");

	// Create toast for robot connected
	bootoast.toast({
		"message": "Connected to robot",
		"icon": "link",
		"type": "success",
		"position": "left-bottom"
	});

	// Hide 'Demo Mode' button and the seperator near it
	$("#power-options-divider").hide();
	$("#demo-mode-button").hide();

	// Icing on the cake
	$("#demo-mode-indicator").show();
}
