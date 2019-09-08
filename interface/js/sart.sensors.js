/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
*/

var last_sensor_data = {
	distance: [],
	thermal_camera: [],
	co2: 0,
	tvoc: 0,
	temp: [],
	charge: 0,
	cpu_temp: 0,
};
var tempChartData = {
	labels: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0],
	datasets: [{
		label: '',
		data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		borderColor: [
			'rgba(234, 67, 53, 1)'
		]
	}]
}
var tempChartOptions = {
	type: 'line',
	data: tempChartData,
	options: {
		elements: {
			line: {
				tension: 0 // disables bezier curves
			}
		},
		animation: {
			duration: 50
		},
		responsive: true,
		title: {
			display: false,
			text: 'Temperature'
		},
		tooltips: {
			enabled: false
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		legend: {
			display: false,
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Time'
				}
			}],
			yAxes: [{
				ticks: {
					min: 20,
					max: 40
				},
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Temperature (°C)'
				}
			}]
		}
	}
}

// Rainbow
function rainbow(n) {
	return 'hsl(' + n * 15 + ',100%,50%)';
}

var percentColors = [
	{ pct: 0.0, color: { r: 0x28, g: 0xa7, b: 0x45 } },
	{ pct: 0.5, color: { r: 0xfd, g: 0x7e, b: 0x14 } },
	{ pct: 1.0, color: { r: 0xdc, g: 0x35, b: 0x45 } }];

function getColorForPercentage (pct) {
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
    // or output as hex if preferred
}  

function update_cameras(config) {
	['front', 'left', 'right', 'back'].forEach(function (e) {
		// Get parent div of camera stream image
		card = $("#camera_" + e + "_card");
		// Enable the div, if camera is enabled in config file
		config[e]['enabled'] ? card.show() : card.hide();
		// Set the images's src attribute to be the relevant port
		$("#camera_" + e).attr("src", portString(config[e]['port']));
	});
}

function update_sensors(config) {
	['thermal_camera', 'temperature', 'distance_graph'].forEach(function (e) {
		// Get parent div of camera stream image
		card = $("#" + e + "_card");
		// Enable the div, if camera is enabled in config file
		config[e]['enabled'] ? card.show() : card.hide();
		// Set the images's src attribute to be the relevant port
		//$("#camera_" + e).attr("src", portString(config[e]['port']));
	});
	if (config['thermal_camera']['enabled']) {
		width = config['thermal_camera']['width'];
		height = config['thermal_camera']['height'];
		// Generate thermal camera table
		x = 0;
		var table = $("<table class='tc'>");
		for (i = 0; i < height; i++) {
			var row = $('<tr>');
			for (j = 0; j < width; j++) {
				row.append("<td class='tc_pixel'><div class='content' id=p" + x + "></div></td>");
				x++;
			}
			table.append(row);
		}
		$('.tc_pixel').css('width', (1 / width * 100) + '%');
		$('#thermal_camera').append(table);
	}
}
$(document).ready(function () {
	// Get temp chart canvas so we can use it as the canvas for our tempchart
	try {
		var tempChartCanvas = $("#tempChart").get(0).getContext('2d');
	} catch (err) {
		console.log(err);
	}
	// Create temperature chart
	var tempChart = new Chart(tempChartCanvas, tempChartOptions);
	// Style that bad boy
	$("#tempChart").attr("style", "display: block; height: 187px; width: 374px;");

	try {
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
			$("#sensor-monitor-pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);

			// Load config file into config editor window
			if ("config" in obj) {
				bootoast.toast({
					"message": "Received config file",
					"type": "success",
					"icon": "file-alt",
					"position": "left-bottom"
				});
				yaml = jsyaml.safeDump(obj['config'], indent = 4);
				$("#config-editor-pre").html(hljs.highlight("YAML", yaml).value);

				// Now handle loading stuff from the config file

				// Enable / disable cameras and set their ports as defined by the config
				update_cameras(obj['config']['cameras']);
				update_sensors(obj['config']['sensors']);

			}

			// Get thermal camera and create pixel grid
			if ("thermal_camera" in obj) {
				var thermal_camera_data = obj["thermal_camera"];

				// Iterate through pixels
				for (i = 0; i < 24; i++) {
					for (j = 0; j < 32; j++) {
						var offset = i * 32 + j;
						// Get pixel color from color table
						var pixel = Math.round(thermal_camera_data[offset]);
						// Apply colour to the appropriate HTML element 
						$("#p" + offset).css("background", rainbow(pixel));
					}
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
				tempChartData.datasets[0].data.shift()
				// Push new element
				tempChartData.datasets[0].data.push(temp_data[0]);
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
				$("#uptime").html(obj["uptime"]);
			}

			// System memory
			if ("memory_used" in obj && "memory_total" in obj) {
				var percent = Number(obj["memory_used"]) / Number(obj["memory_total"]);
				$("#memory").css('color', getColorForPercentage(percent))
				$("#memory").html(obj["memory_used"] + "/" + obj["memory_total"] + " MB");
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
	} catch (err) {
		console.log(err);
	}
});