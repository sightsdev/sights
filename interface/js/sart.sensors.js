/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

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

// Robot time of boot
var start_time;
// Total RAM
var memory_total;

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
		let id = config[e]['id']
		camera.attr("src", "http://" + ip + ":8081/" + id + "/stream");
		camera.attr("id", config[e]['id']);
	});
	if (config['front']['enabled'] &&
		!config['back']['enabled'] &&
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

function set_speed_indicator(type, speed) {
	// Type is either 'kb' or 'gp'
	// Given speed (127 to 1023) needs to be between 1 and 8
	speed = (speed + 1) / 128;
	// Now we enabled relevant nodes
	for (var i = 0; i < 8; i++) {
		var val = i < speed ? '12.5%' : '0%';
		$("#" + type + "_speed_node_" + (i + 1)).css('width', val)
	}
}

$(document).ready(function () {
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

	// Start WebSocket receiver
	var sensorSocket = new WebSocket("ws://" + ip + ":5556");

	sensorSocket.onopen = function (event) {
		$("#robot_status").html("<i class='fa fa-fw fa-link'></i>");
		$("#robot_status").attr("class", "btn btn-success");

		bootoast.toast({
			"message": "Connected to robot",
			"type": "success",
			"icon": "link",
			"position": "left-bottom"
		});
	};
	sensorSocket.onclose = function (event) {
		$("#robot_status").html("<i class='fa fa-fw fa-unlink'></i> Disconnected from robot");
		$("#robot_status").attr("class", "btn btn-danger");

		bootoast.toast({
			"message": "Disconnected from robot",
			"type": "danger",
			"icon": "unlink",
			"position": "left-bottom"
		});
	};
	// Setup update event
	sensorSocket.onmessage = function (event) {
		var obj = JSON.parse(event.data);

		// Update sensor monitor (in log modal)
		$("#sensor_monitor_pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);

		// Load config file into config editor window
		if ("config" in obj) {
			bootoast.toast({
				"message": "Received config file",
				"type": "success",
				"icon": "file-alt",
				"position": "left-bottom"
			});
			var yaml = jsyaml.safeDump(obj['config'], indent = 4);
			$("#config_editor_pre").html(hljs.highlight("YAML", yaml).value);

			// Now handle loading stuff from the config file

			// Enable / disable cameras and set their ports as defined by the config
			update_cameras(obj['config']['cameras']);
			update_sensors(obj['config']['sensors']);

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
			var co2 = obj["co2"];
			// Update graph
			$("#co2_level").html(co2 + "<span style='font-size: 10px'> ppm</span>");
			$("#co2_graph").attr('class', "c100 med orange center p" + Math.round(co2 / 100));
		}

		// Get TVOC levels
		if ("tvoc" in obj) {
			var tvoc = obj["tvoc"];
			// Update graph
			$("#tvoc_level").html(tvoc + "<span style='font-size: 10px'> ppb</span>");
			$("#tvoc_graph").attr('class', "c100 med orange center p" + Math.round(tvoc / 100));
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
			var charge_data = obj["charge"];
			// Update graph
			$("#charge_level").html(charge_data + "%");
			$("#charge_graph").attr('class', "c100 med orange center p" + charge_data);
		}

		// Highest CPU core temperature
		if ("cpu_temp" in obj) {
			var cpu_temp = Math.round(obj["cpu_temp"]);
			$("#cputemp_level").html(cpu_temp + "&degC");
			$("#cputemp_graph").attr('class', "c100 med orange center p" + cpu_temp);
		}

		// System uptime
		if ("uptime" in obj) {
			// Calculate time of boot 
			start_time = Date.now() - (obj["uptime"] * 1000);
			setInterval(() => {
				// Calculate uptime based on time elapsed since reported time of boot
				var upt = new Date(Date.now() - start_time).toISOString().substr(11, 8);
				// Format nicely
				$("#uptime").html(upt);
			}, 1000);
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
			set_speed_indicator("kb", obj["kb_speed"]);
		}
		if ("gp_speed" in obj) {
			set_speed_indicator("gp", obj["gp_speed"]);
		}

		last_sensor_data = obj;
	}
});
