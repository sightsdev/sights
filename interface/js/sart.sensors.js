/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
*/

var sensorSocket;

var last_sensor_data = {
	distance: [],
	thermal_camera: [],
	co2: 0,
	tvoc: 0,
	temp: [],
	charge: 0,
	cpu_temp: 0,
};

var camColors = [0x480F,
	0x400F, 0x400F, 0x400F, 0x4010, 0x3810, 0x3810, 0x3810, 0x3810, 0x3010, 0x3010,
	0x3010, 0x2810, 0x2810, 0x2810, 0x2810, 0x2010, 0x2010, 0x2010, 0x1810, 0x1810,
	0x1811, 0x1811, 0x1011, 0x1011, 0x1011, 0x0811, 0x0811, 0x0811, 0x0011, 0x0011,
	0x0011, 0x0011, 0x0011, 0x0031, 0x0031, 0x0051, 0x0072, 0x0072, 0x0092, 0x00B2,
	0x00B2, 0x00D2, 0x00F2, 0x00F2, 0x0112, 0x0132, 0x0152, 0x0152, 0x0172, 0x0192,
	0x0192, 0x01B2, 0x01D2, 0x01F3, 0x01F3, 0x0213, 0x0233, 0x0253, 0x0253, 0x0273,
	0x0293, 0x02B3, 0x02D3, 0x02D3, 0x02F3, 0x0313, 0x0333, 0x0333, 0x0353, 0x0373,
	0x0394, 0x03B4, 0x03D4, 0x03D4, 0x03F4, 0x0414, 0x0434, 0x0454, 0x0474, 0x0474,
	0x0494, 0x04B4, 0x04D4, 0x04F4, 0x0514, 0x0534, 0x0534, 0x0554, 0x0554, 0x0574,
	0x0574, 0x0573, 0x0573, 0x0573, 0x0572, 0x0572, 0x0572, 0x0571, 0x0591, 0x0591,
	0x0590, 0x0590, 0x058F, 0x058F, 0x058F, 0x058E, 0x05AE, 0x05AE, 0x05AD, 0x05AD,
	0x05AD, 0x05AC, 0x05AC, 0x05AB, 0x05CB, 0x05CB, 0x05CA, 0x05CA, 0x05CA, 0x05C9,
	0x05C9, 0x05C8, 0x05E8, 0x05E8, 0x05E7, 0x05E7, 0x05E6, 0x05E6, 0x05E6, 0x05E5,
	0x05E5, 0x0604, 0x0604, 0x0604, 0x0603, 0x0603, 0x0602, 0x0602, 0x0601, 0x0621,
	0x0621, 0x0620, 0x0620, 0x0620, 0x0620, 0x0E20, 0x0E20, 0x0E40, 0x1640, 0x1640,
	0x1E40, 0x1E40, 0x2640, 0x2640, 0x2E40, 0x2E60, 0x3660, 0x3660, 0x3E60, 0x3E60,
	0x3E60, 0x4660, 0x4660, 0x4E60, 0x4E80, 0x5680, 0x5680, 0x5E80, 0x5E80, 0x6680,
	0x6680, 0x6E80, 0x6EA0, 0x76A0, 0x76A0, 0x7EA0, 0x7EA0, 0x86A0, 0x86A0, 0x8EA0,
	0x8EC0, 0x96C0, 0x96C0, 0x9EC0, 0x9EC0, 0xA6C0, 0xAEC0, 0xAEC0, 0xB6E0, 0xB6E0,
	0xBEE0, 0xBEE0, 0xC6E0, 0xC6E0, 0xCEE0, 0xCEE0, 0xD6E0, 0xD700, 0xDF00, 0xDEE0,
	0xDEC0, 0xDEA0, 0xDE80, 0xDE80, 0xE660, 0xE640, 0xE620, 0xE600, 0xE5E0, 0xE5C0,
	0xE5A0, 0xE580, 0xE560, 0xE540, 0xE520, 0xE500, 0xE4E0, 0xE4C0, 0xE4A0, 0xE480,
	0xE460, 0xEC40, 0xEC20, 0xEC00, 0xEBE0, 0xEBC0, 0xEBA0, 0xEB80, 0xEB60, 0xEB40,
	0xEB20, 0xEB00, 0xEAE0, 0xEAC0, 0xEAA0, 0xEA80, 0xEA60, 0xEA40, 0xF220, 0xF200,
	0xF1E0, 0xF1C0, 0xF1A0, 0xF180, 0xF160, 0xF140, 0xF100, 0xF0E0, 0xF0C0, 0xF0A0,
	0xF080, 0xF060, 0xF040, 0xF020, 0xF800
];

var tempChart;
var tempChartCanvas;
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

$(document).ready(function () {
	// Get temp chart canvas so we can use it as the canvas for our tempchart
	try {
		tempChartCanvas = $("#tempChart").get(0).getContext('2d');
	} catch (err) {
		console.log(err);
	}
	// Create temperature chart
	tempChart = new Chart(tempChartCanvas, tempChartOptions);
	// Style that bad boy
	$("#tempChart").attr("style", "display: block; height: 187px; width: 374px;");

	try {
		// Start WebSocket receiver
		sensorSocket = new WebSocket("ws://" + ip + ":5556");

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
				$("#co2_graph").attr('class', "c100 med orange p" + Math.round(co2 / 100));
			}

			// Get TVOC levels
			if ("tvoc" in obj) {
				var tvoc = obj["tvoc"];
				// Update graph
				$("#tvoc_level").html(tvoc + "<span style='font-size: 10px'> ppb</span>");
				$("#tvoc_graph").attr('class', "c100 med orange p" + Math.round(tvoc / 100));
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
				$("#charge_graph").attr('class', "c100 med orange p" + charge_data);
			}

			// Highest CPU core temperature
			if ("cpu_temp" in obj) {
				var cpu_temp = Math.round(obj["cpu_temp"]);
				$("#cputemp_level").html(cpu_temp + "&degC");
				$("#cputemp_graph").attr('class', "c100 med orange p" + cpu_temp);
			}

			// System uptime
			if ("uptime" in obj) {
				$("#uptime").html("Uptime: " + obj["uptime"]);
			}

			// System memory
			if ("memory_used" in obj && "memory_total" in obj) {
				$("#memory").html("Memory: " + obj["memory_used"] + "/" + obj["memory_total"] + " MB");
			}

			last_sensor_data = obj;
		}
	} catch (err) {
		console.log(err);
	}
});