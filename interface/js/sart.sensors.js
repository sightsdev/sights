var ip = window.location.hostname;

var tempChartCanvas = document.getElementById("tempChart").getContext('2d');
var distChartCanvas = document.getElementById("distChart").getContext('2d');

console.log("Starting sensor reciever");

var camColors = [0x480F,
0x400F,0x400F,0x400F,0x4010,0x3810,0x3810,0x3810,0x3810,0x3010,0x3010,
0x3010,0x2810,0x2810,0x2810,0x2810,0x2010,0x2010,0x2010,0x1810,0x1810,
0x1811,0x1811,0x1011,0x1011,0x1011,0x0811,0x0811,0x0811,0x0011,0x0011,
0x0011,0x0011,0x0011,0x0031,0x0031,0x0051,0x0072,0x0072,0x0092,0x00B2,
0x00B2,0x00D2,0x00F2,0x00F2,0x0112,0x0132,0x0152,0x0152,0x0172,0x0192,
0x0192,0x01B2,0x01D2,0x01F3,0x01F3,0x0213,0x0233,0x0253,0x0253,0x0273,
0x0293,0x02B3,0x02D3,0x02D3,0x02F3,0x0313,0x0333,0x0333,0x0353,0x0373,
0x0394,0x03B4,0x03D4,0x03D4,0x03F4,0x0414,0x0434,0x0454,0x0474,0x0474,
0x0494,0x04B4,0x04D4,0x04F4,0x0514,0x0534,0x0534,0x0554,0x0554,0x0574,
0x0574,0x0573,0x0573,0x0573,0x0572,0x0572,0x0572,0x0571,0x0591,0x0591,
0x0590,0x0590,0x058F,0x058F,0x058F,0x058E,0x05AE,0x05AE,0x05AD,0x05AD,
0x05AD,0x05AC,0x05AC,0x05AB,0x05CB,0x05CB,0x05CA,0x05CA,0x05CA,0x05C9,
0x05C9,0x05C8,0x05E8,0x05E8,0x05E7,0x05E7,0x05E6,0x05E6,0x05E6,0x05E5,
0x05E5,0x0604,0x0604,0x0604,0x0603,0x0603,0x0602,0x0602,0x0601,0x0621,
0x0621,0x0620,0x0620,0x0620,0x0620,0x0E20,0x0E20,0x0E40,0x1640,0x1640,
0x1E40,0x1E40,0x2640,0x2640,0x2E40,0x2E60,0x3660,0x3660,0x3E60,0x3E60,
0x3E60,0x4660,0x4660,0x4E60,0x4E80,0x5680,0x5680,0x5E80,0x5E80,0x6680,
0x6680,0x6E80,0x6EA0,0x76A0,0x76A0,0x7EA0,0x7EA0,0x86A0,0x86A0,0x8EA0,
0x8EC0,0x96C0,0x96C0,0x9EC0,0x9EC0,0xA6C0,0xAEC0,0xAEC0,0xB6E0,0xB6E0,
0xBEE0,0xBEE0,0xC6E0,0xC6E0,0xCEE0,0xCEE0,0xD6E0,0xD700,0xDF00,0xDEE0,
0xDEC0,0xDEA0,0xDE80,0xDE80,0xE660,0xE640,0xE620,0xE600,0xE5E0,0xE5C0,
0xE5A0,0xE580,0xE560,0xE540,0xE520,0xE500,0xE4E0,0xE4C0,0xE4A0,0xE480,
0xE460,0xEC40,0xEC20,0xEC00,0xEBE0,0xEBC0,0xEBA0,0xEB80,0xEB60,0xEB40,
0xEB20,0xEB00,0xEAE0,0xEAC0,0xEAA0,0xEA80,0xEA60,0xEA40,0xF220,0xF200,
0xF1E0,0xF1C0,0xF1A0,0xF180,0xF160,0xF140,0xF100,0xF0E0,0xF0C0,0xF0A0,
0xF080,0xF060,0xF040,0xF020,0xF800];

// TEST POPULATE THERMAL DISPLAY
function rainbow(n) {
	return 'hsl(' + n * 15 + ',100%,50%)';
}
var ir_test = [
  [20, 22, 23, 24, 25, 24, 23, 22],
  [19, 20, 22, 23, 23, 24, 22, 21],
  [19, 18, 22, 24, 22, 23, 22, 20],
  [18, 17, 17, 18, 20, 23, 22, 21],
  [17, 15, 15, 17, 19, 20, 22, 23],
  [17, 14, 14, 17, 18, 19, 20, 22],
  [18, 15, 15, 18, 20, 22, 23, 24],
  [20, 19, 19, 20, 22, 23, 24, 25]
];
for (i = 0; i < 8; i++) {
	for (j = 0; j < 8; j++) {
		var offset = i * 8 + j;
		var pixel = ir_test[i][j];
		document.getElementById("p" + (offset + 1)).style = "background:" + rainbow(pixel);
	}
}

// CHARTS
var distChartData = {
	labels: ['Front', 'Right', 'Back', 'Left'],
	datasets: [{
		data: [0,0,0,0],
		backgroundColor: [
		"rgba(0, 255, 0, 0.8)",
		"rgba(0, 255, 200, 0.8)",
		"rgba(0, 255, 200, 0.8)",
		"rgba(0, 255, 200, 0.8)"
		],
		borderColor: "rgba(0, 0, 0, 0.5)"
	}]
};

var distChartOptions = {
	startAngle: 5 * Math.PI / 4,
	legend: {
		position: 'left',
		display: false
	},
	animation: {
		animateRotate: false
	},
	scale: {
		ticks: {
			max: 1000,
			min: 0,
			stepSize: 100
		}
	}
};

var distChart = new Chart(distChartCanvas, {
	type: 'polarArea',
	data: distChartData,
	options: distChartOptions
});



var tempChart = new Chart(tempChartCanvas, {
	type: 'line',
	data: {
		datasets: [{
			label: 'Sensor Front',
			data: [0, 0, 1, 3, 5, 7],
			borderColor: [
				'rgba(128, 0, 0, 1)'
			]
		},
		{
			label: 'Sensor Left',
			data: [0, 0, 2, 4, 6, 8],
			borderColor: [
				'rgba(0, 128, 0, 1)'
			]
		},
		{
			label: 'Sensor Right',
			data: [0, 2, 6, 9, 11, 12],
			borderColor: [
				'rgba(0, 0, 128, 1)'
			]
		},
		{
			label: 'Sensor Back',
			data: [0, 0, 0, 0, 1, 4],
			borderColor: [
				'rgba(128, 128, 0, 1)'
			]
		}]
	}
});
var sensorSocket = new WebSocket("ws://" + ip + ":5556");

sensorSocket.onmessage = function(event) {
	var str = event.data;
        var obj = JSON.parse(str);

	if ("dist" in obj) {
		// update distance chart
		var new_data = [];
    		// unfortunately the graph has directions clockwise (front, right, back, left) in the array. We have them front, left, right, back
		new_data[0] = obj["dist"][0];
		new_data[1] = obj["dist"][2];
		new_data[2] = obj["dist"][3];
		new_data[3] = obj["dist"][1];
		// change chart dataset to use new data
		distChartData.datasets[0].data = new_data;
    		// reload chart with new data
		distChart.update()
	}
    	// get performance data
	// The information passed depends on the hardware you are using. 
	// While almost every device will have their memory and cpu data available through psutils, exceptions can occur and modifications might need to be made
	//var memory_total = Math.round(obj.memory_total/1048576);
	//var memory_used = Math.round(obj.memory_used/1048576);
	//var cpu_percent = Math.round(obj.cpu_percent);
	var highest_temp = Math.round(obj.highest_temp);
	//var uptime = Math.round(obj.uptime);

	// Fancy stuff to display in megabytes if the used RAM is less than a gigabyte.
	/*if (memory_used < 1024) {
		document.getElementById("ram").innerHTML = memory_used + " MB";
	}
	else {
		document.getElementById("ram").innerHTML = (memory_used/1024).toFixed(2) + " GB";
	}

	document.getElementById("ramPercentage").className = "c100 med orange p" + Math.round((memory_used/memory_total)*100);

	document.getElementById("cpu").innerHTML = cpu_percent + "%";
	document.getElementById("cpuPercentage").className = "c100 med orange p" + cpu_percent;
	*/
	document.getElementById("cputemp_level").innerHTML = highest_temp + "&degC";
	document.getElementById("cputemp_graph").className = "c100 med orange p" + highest_temp;
	//document.getElementById("uptime").innerHTML = new Date(1000 * uptime).toISOString().substr(11, 8) + "";
}

