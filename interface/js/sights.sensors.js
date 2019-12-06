/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

var sensorSocket;
var sensorConnected = false;

var tempChart, distChart;

var last_sensor_data = {
	distance: [],
	thermal_camera: [],
	co2: 0,
	tvoc: 0,
	temp: [],
	charge: 0,
	cpu_temp: 0,
};

// Total RAM
var memory_total;

var running_config;

// Rainbow
function rainbow(n) {
	return 'hsl(' + n * 15 + ', 100%, 50%)';
}

var percentColors = [{
		pct: 0.0,
		color: {
			r: 0x28,
			g: 0xa7,
			b: 0x45
		}
	},
	{
		pct: 0.5,
		color: {
			r: 0xfd,
			g: 0x7e,
			b: 0x14
		}
	},
	{
		pct: 1.0,
		color: {
			r: 0xdc,
			g: 0x35,
			b: 0x45
		}
	}
];

function getColorForPercentage(pct) {
	for (var i = 1; i < percentColors.length - 1; i++) {
		if (pct < percentColors[i].pct) {
			break;
		}
	}
	var lower = percentColors[i - 1];
	var upper = percentColors[i];
	var range = upper.pct - lower.pct;
	var rangePct = (pct - lower.pct) / range;
	var pctLower = 1 - rangePct;
	var pctUpper = rangePct;
	var color = {
		r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
		g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
		b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
	};
	return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
}

function update_cameras(config) {
	['front', 'left', 'right', 'back'].forEach(function (e) {
		// Get parent div of camera stream image
		var card = $("#camera_" + e + "_card");
		// Enable the div, if camera is enabled in config file
		config[e]['enabled'] ? card.show() : card.hide();
		// Set image attributes to the relevant URL
		let camera = $("#camera_" + e);
		let id = config[e]['id'];
		camera.attr("src", "http://" + ip + ":8081/" + id + "/stream");
		camera.attr("data-id", config[e]['id']);
	});
	if (!config['back']['enabled'] &&
		!config['left']['enabled'] &&
		!config['right']['enabled']) {
		$("#sensor_toggle").hide();
		$("#btm_view_camera").hide();
		$("#btm_view_sensors").show();
		$("#sensor_toggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Sensors");
		sensorMode = false;
	}
}

function update_sensors(config) {
	['thermal_camera', 'temperature', 'distance'].forEach(function (e) {
		// Get parent div of camera stream image
		var card = $("#" + e + "_card");
		// Enable the div, if camera is enabled in config file
		config[e]['enabled'] ? card.show() : card.hide();
	});
	if (config['thermal_camera']['enabled']) {
		var width = config['thermal_camera']['width'];
		var height = config['thermal_camera']['height'];
		// Generate thermal camera table
		var x = 0;
		var table = $("<table>");
		for (i = 0; i < height; i++) {
			var row = $('<tr>');
			for (j = 0; j < width; j++) {
				row.append("<td style='width: " + ((1 / width) * 100) + "%;position: relative;'><div class='content' id=p" + x + "></div></td>");
				x++;
			}
			table.append(row);
		}
		$('#thermal_camera').html(table);
	}
}

function set_speed_indicator_raw(type, speed) {
	// Type is either 'kb' or 'gp'
	// Given speed (127 to 1023) needs to be between 1 and 8
	speed = (speed + 1) / 128;
	// Now we enabled relevant nodes
	set_speed_indicator(type, speed);
}

function set_speed_indicator(type, speed) {
	// Enables / disables relevant nodes (1 - 8) for speed indicators
	for (var i = 0; i < 8; i++) {
		var val = i < speed ? '12.5%' : '0%';
		$("#" + type + "_speed_node_" + (i + 1)).css('width', val);
	}
}

function sensorConnection() {
	if(!demo) {
		// Start WebSocket receiver
		sensorSocket = new WebSocket("ws://" + ip + ":5556");
		sensorSocket.onopen = function() {
			sensorConnected = true;
			sensorsConnectedAlert();
		};
		sensorSocket.onclose = function() {
			if (sensorConnected) {
				sensorsDisconnectedAlert();
				sensorConnected = false;
			}

			setTimeout(function () {
				sensorConnection()
			}, 5000);
		};
		// Setup update event
		sensorSocket.onmessage = function (event) {
			var obj = JSON.parse(event.data);

			// Update sensor monitor (in log modal)
			$("#sensor_monitor_pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);

			if("initial_message" in obj) {
				requestConfig(function(response) {
					configReceivedAlert();

					// Set running config
					running_config = obj["running_config"]
					$("#current_config").html(running_config);
					$(".editor_filename").val(running_config);

					// Populate visual editor
					// Populating advanced editor happens on configEditor change, which fires when the inital config is set
					configEditor.setValue(response);
					// Keep a copy to track changes
					baseConfig = JSON.stringify(configEditor.getValue());
					savedConfig = baseConfig;
					updateConfigAlerts();

					// Manually set output text of range slider elements
					$('output', $('#visual_editor_container'))[0].innerText = response['control']['default_gamepad_speed'];
					$('output', $('#visual_editor_container'))[1].innerText = response['control']['default_keyboard_speed'];

					// Now handle loading stuff from the config file
					// Enable / disable cameras and set their ports as defined by the config
					update_cameras(response['cameras']);
					update_sensors(response['sensors']);
				});
			}

			// Software versions
			if ("version_robot" in obj) {
				$("#version_robot").html(obj["version_robot"]);
			}
			if ("version_interface" in obj) {
				$("#version_interface").html(obj["version_interface"]);
			}

			// Get distance data and create radial graph
			if ("distance" in obj) {
				// Update distance chart
				var dist_data = [];
				// Unfortunately the graph has directions clockwise (front, right, back, left) in the array.
				// We have them front, left, right, back
				dist_data[0] = obj["distance"][0];
				dist_data[1] = obj["distance"][2];
				dist_data[2] = obj["distance"][3];
				dist_data[3] = obj["distance"][1];
				// Change chart dataset to use new data
				distChartConfig.data.datasets[0].data = dist_data;
				// Reload chart with new data
				distChart.update();
			}

			// Get thermal camera and create pixel grid
			if ("thermal_camera" in obj) {
				var thermal_camera_data = obj["thermal_camera"];

				// Iterate through pixels
				for (i = 0; i < thermal_camera_data.length; i++) {
					// Apply colour to the appropriate HTML element
					var pixel = Math.round(thermal_camera_data[i]);
					$("#p" + i).css("background", rainbow(pixel));
				}
			}

			// Get CO2 levels
			if ("co2" in obj) {
				updateCircle("co2", obj["co2"], 10);
			}

			// Get TVOC levels
			if ("tvoc" in obj) {
				updateCircle("tvoc", obj["tvoc"], 3)
			}

			// Get temperature data for line graph
			if ("temp" in obj) {
				var temp_data = obj["temp"];
				// Remove oldest element
				tempChartConfig.data.datasets[0].data.shift();
				// Push new element
				tempChartConfig.data.datasets[0].data.push(temp_data[0]);
				// Update chart to display new data
				tempChart.update();
			}

			// Get charge level
			if ("charge" in obj) {
				updateCircle("charge", obj["charge"]);
			}

			// Highest CPU core temperature
			if ("cpu_temp" in obj) {
				updateCircle("cpu_temp", Math.round(obj["cpu_temp"]));
			}

			// System uptime
			if ("uptime" in obj) {
				startTime = Date.now() - (obj["uptime"] * 1000);
			}

			// System memory
			if ("memory_used" in obj) {
				var percent = Number(obj["memory_used"]) / memory_total;
				$("#memory").css('color', getColorForPercentage(percent));
				$("#memory_used").html(obj["memory_used"]);
			}
			if ("memory_total" in obj) {
				memory_total = Number(obj["memory_total"]);
				$("#memory_total").html(obj["memory_total"]);
			}

			// Speed indicators for keyboard and gamepad
			if ("kb_speed" in obj) {
				set_speed_indicator_raw("kb", obj["kb_speed"]);
			}
			if ("gp_speed" in obj) {
				set_speed_indicator_raw("gp", obj["gp_speed"]);
			}

			last_sensor_data = obj;
		}
	}
}

$(document).on("ready",function () {
	// Get temp chart canvas so we can use it as the canvas for our tempchart
	try {
		let tempChartCanvas = $("#temp_chart").get(0).getContext('2d');
		let distChartCanvas = $("#dist_chart").get(0).getContext('2d');
		// Create temperature and distance chart
		tempChart = new Chart(tempChartCanvas, tempChartConfig);
		distChart = new Chart(distChartCanvas, distChartConfig);
		// Style that bad boy
		$("#temp_chart").attr("style", "display: block; height: 187px; width: 374px;");
		$("#dist_chart").attr("style", "display: block; height: 187px; width: 374px;");
	} catch (err) {
		console.log(err);
	}

	sensorConnection();
});
