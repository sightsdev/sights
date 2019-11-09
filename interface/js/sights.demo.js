/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/
var demo = false;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Populate interface with dummy data to demonstrate what a functional setup looks like
function DemoMode() {
	demo = true;
	// Camera streams, load dummy images
	let imageSets = 8; // Number of sets of images in images/demo_camera
	let set = Math.floor(Math.random()*imageSets);
	$('.stream-image').each(function() {
		let id = $(this).attr("id");
		let src = "images/demo_camera/set-" + set + "/" + id + ".jpg";
		$(this).attr('src',src);
		$(this).attr('refresh_src',src);
		$(this).className = "stream-image";
	});

	// SSH modal needs some content
	$(".ssh-container iframe").attr('src', 'https://gitsuppository.net/');	// Set src for currently open terminals

	gamepadConnectedAlert();
	// Active gamepad dropdown menu
	$('#gamepad_select').html('<option value="0" id="gamepad">Xbox 360 Controller</option>');

	// Gamepad monitor data
	let obj = {
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
	};
	$('#gamepad_monitor_pre').html(hljs.highlight("JSON",JSON.stringify(obj, null, '\t')).value);

	// Config editor box
	obj = {"network":{"ip":"localhost"},"control":{"default_gamepad_speed":5,"default_keyboard_speed":5},"motors":{
	    "type":"dynamixel","port":"/dev/ttyACM0","baudrate":1000000,"ids":{"left":[],"right":[]}},"arduino":{"enabled":
                false},"cameras":{"front":{"enabled":true,"id":1},"back":{"enabled":true,"id":2},"left":{"enabled":false
            },"right":{"enabled":false}},"sensors":{"memory":{"enabled":true,"frequency":3},"cpu_temp":{"enabled":true,
                "frequency":5},"thermal_camera":{"enabled":true,"frequency":0.5,"width":32,"height":24},"temperature":{
                "enabled":true,"frequency":2,"address":""},"distance":{"enabled":false},"gas":{"enabled":false}},"debug"
            :{"print_messages":false}};

    configEditor.setValue(obj);
    baseConfig = savedConfig = JSON.stringify(obj);
    updateConfigAlerts();

	var example_log = `2019-11-09 13:37:04,068 INFO __main__: Starting manager process
	2019-11-09 13:37:04,069 INFO __main__: Using config file: configs/virtual.json
	2019-11-09 13:37:04,071 INFO __main__: PID 289
	2019-11-09 13:37:04,072 INFO motors: Opening motor connection of type: virtual
	2019-11-09 13:37:04,084 INFO sensor_stream: Starting SensorStream-1 process at *:5556
	2019-11-09 13:37:04,088 INFO control_receiver: Starting ControlReceiver-2 process at *:5555
	2019-11-09 13:37:04,320 INFO sensor_stream: Client connected
	2019-11-09 13:37:04,321 INFO sensor_stream: Sent initial message`.replace(/\t+/g, "");

	// Stop updateService from being run every half second
	clearInterval(serviceUpdater);
	// Update service monitor
	$("#service_info_statename").addClass("btn-success").html("Running");
	$('#config_selector').html("");
	// Populate config selector
	$('#config_selector').append('<option value="demo.json">demo.json</option>');

	// Update log modal
	$("#service_info_logfile").html("/opt/sights/sights.log");
	$("#service_info_pre").html(hljs.highlight("YAML", example_log).value);

	// After the sensor socket has connected
	setTimeout(function(){
		sensorsConnectedAlert();
		configReceivedAlert();

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
		
		// Randomisers for CPU temp and gas sensor readings
		setInterval(() => {
			// CPU temp graph
			var temp = getRandomInt(40, 45);
			$("#cputemp_level").html(temp + "&degC");
			$("#cputemp_graph").attr('class', "c100 med orange center p" + temp);
		}, 2000);
		setInterval(() => {
			// CO2 level
			var temp = getRandomInt(200, 230);
			$("#co2_level").html(temp + "<span style='font-size: 10px'> ppm</span>");
			$("#co2_graph").attr('class', "c100 med orange center p" + Math.round(temp / 10));
			// TVOC level
			var temp = getRandomInt(10, 14);
			$("#tvoc_level").html(temp * 3 + "<span style='font-size: 10px'> ppb</span>");
			$("#tvoc_graph").attr('class', "c100 med orange center p" + temp);
		}, 3000);

		// Decrease charge every 21.35 seconds (Unusual number so it doesn't match up with other change events)
		setInterval(() => {
			// Charge level
			// Get last charge level and subtract one
			var temp = $("#charge_level").html().slice(0, -1) - 1;
			// Loop around just in case
			if (temp <= 0) {
                let charger = setInterval(function () {
                    temp += 1;
                    $("#charge_level").html(temp + "%");
                    $("#charge_graph").attr('class', "c100 med orange center p" + temp);
                    if(temp == 100) window.clearInterval(charger);
                }, 10);
			}
			$("#charge_level").html(temp + "%");
			$("#charge_graph").attr('class', "c100 med orange center p" + temp);
		}, 20000 + Math.ceil(Math.random()*5000));
		
		// Temperature history graph
		tempChartConfig.data.datasets[0].data = [22, 22, 22, 24, 22, 24, 28, 29, 27, 24, 25, 24, 23, 22, 22];
		tempChart.update();
		// Distance radial graph
		distChartConfig.data.datasets[0].data = [768, 128, 256, 312]; // Four directions
		distChart.update();

		// Uptime
		// Set boot time to yesterday at 7:59pm
		startTime = new Date();
		startTime.setDate(startTime.getDate() - 1);
		startTime.setHours(19,59);
		// Memory
		$("#memory").css('color', getColorForPercentage(0.3));
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

		// Hue values for demo thermal camera data
		var thermal_camera_data = [244, 246, 248, 250, 252, 252, 251, 253, 251, 250, 248, 248, 247, 247, 247, 246, 246, 246, 246, 246, 246, 246, 246, 246, 248, 248, 249, 248, 249, 249, 250, 249, 235, 241, 244, 245, 245, 244, 244, 245, 244, 243, 243, 243, 241, 239, 239, 240, 241, 240, 238, 238, 239, 239, 240, 242, 243, 243, 243, 243, 242, 243, 243, 244, 222, 230, 236, 235, 234, 235, 235, 236, 234, 232, 232, 228, 226, 226, 226, 226, 226, 225, 225, 226, 225, 224, 226, 227, 229, 229, 229, 229, 231, 230, 231, 231, 212, 218, 221, 221, 222, 223, 223, 222, 220, 219, 219, 218, 215, 216, 216, 214, 213, 216, 216, 215, 217, 216, 216, 216, 216, 217, 219, 219, 218, 219, 220, 220, 204, 210, 213, 212, 212, 214, 213, 212, 211, 210, 210, 208, 206, 207, 170, 26, 169, 205, 207, 206, 206, 206, 207, 208, 207, 206, 209, 210, 209, 209, 211, 210, 193, 199, 202, 201, 202, 203, 203, 201, 199, 200, 200, 196, 198, 184, 88, 9, 129, 191, 197, 195, 194, 194, 196, 196, 195, 195, 198, 198, 196, 196, 200, 198, 182, 188, 192, 191, 189, 192, 193, 190, 186, 188, 188, 185, 181, 68, 9, 11, 156, 181, 183, 179, 179, 181, 184, 183, 182, 183, 184, 184, 182, 182, 187, 185, 167, 173, 177, 177, 174, 179, 178, 173, 171, 173, 172, 168, 158, 21, 10, 8, 89, 169, 168, 164, 164, 166, 167, 167, 166, 166, 170, 169, 168, 169, 174, 172, 149, 155, 158, 157, 155, 160, 162, 156, 155, 158, 157, 154, 145, 14, 0, 2, 27, 129, 150, 146, 147, 148, 151, 151, 152, 151, 154, 153, 152, 156, 159, 158, 125, 135, 138, 136, 136, 144, 144, 135, 137, 139, 138, 132, 125, 98, 7, 360, 18, 107, 132, 127, 127, 128, 130, 126, 127, 133, 137, 132, 130, 136, 141, 146, 120, 120, 121, 121, 120, 122, 122, 121, 121, 121, 121, 120, 121, 51, 8, 2, 62, 39, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 127, 149, 120, 120, 120, 120, 120, 120, 120, 119, 120, 120, 120, 119, 120, 102, 0, 0, 61, 118, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 139, 119, 120, 119, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 19, 0, 81, 120, 120, 120, 120, 120, 119, 120, 120, 120, 120, 120, 120, 120, 121, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 121, 120, 44, 0, 78, 120, 120, 121, 120, 120, 120, 120, 120, 121, 120, 120, 120, 120, 120, 120, 93, 104, 114, 117, 118, 120, 119, 119, 120, 119, 118, 117, 119, 107, 2, 1, 79, 111, 116, 116, 120, 115, 117, 117, 112, 104, 116, 119, 120, 120, 120, 120, 72, 79, 88, 89, 89, 92, 90, 91, 90, 90, 91, 89, 91, 28, 7, 10, 74, 83, 85, 86, 90, 89, 85, 78, 51, 58, 87, 91, 110, 106, 104, 97, 60, 67, 71, 75, 77, 77, 74, 77, 78, 76, 75, 74, 73, 5, 15, 35, 72, 74, 74, 76, 77, 74, 74, 76, 76, 82, 86, 84, 102, 117, 104, 97, 47, 53, 56, 60, 61, 62, 63, 65, 65, 64, 64, 65, 65, 56, 45, 49, 68, 69, 71, 71, 72, 72, 75, 77, 81, 83, 90, 68, 85, 116, 102, 99, 43, 48, 53, 56, 57, 57, 62, 62, 63, 64, 64, 62, 66, 61, 64, 66, 68, 68, 68, 68, 69, 71, 74, 74, 77, 79, 76, 72, 80, 88, 90, 84, 44, 48, 54, 57, 59, 57, 61, 64, 65, 65, 63, 64, 66, 64, 62, 65, 67, 68, 67, 67, 71, 72, 72, 73, 73, 69, 49, 54, 73, 81, 82, 79, 43, 48, 54, 56, 58, 58, 61, 62, 64, 62, 62, 65, 65, 65, 63, 67, 70, 70, 70, 71, 71, 71, 70, 70, 73, 72, 61, 54, 70, 78, 81, 82, 38, 42, 51, 56, 58, 57, 59, 61, 61, 59, 60, 63, 64, 64, 63, 64, 67, 67, 66, 69, 70, 69, 69, 71, 71, 64, 61, 56, 67, 76, 81, 81, 36, 41, 50, 55, 56, 55, 57, 58, 59, 57, 60, 66, 65, 64, 62, 60, 62, 62, 59, 63, 63, 63, 64, 65, 62, 49, 51, 60, 61, 71, 74, 77, 32, 39, 47, 53, 56, 55, 57, 56, 56, 56, 61, 64, 60, 57, 54, 53, 56, 57, 56, 59, 59, 58, 59, 63, 52, 45, 41, 52, 63, 71, 73, 73];

		// Create example pixel grid for thermal camera
		for (i = 0; i < thermal_camera_data.length; i++) {
			// Apply colour to the appropriate HTML element
			$("#p" + i).css("background", 'hsl(' + thermal_camera_data[i] + ', 100%, 50%)');
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
		$("#sensor_monitor_pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);
	},Math.ceil(Math.random()*2000));

	// After the control socket has connected
	setTimeout(function(){
		controlConnectedAlert();
	},Math.ceil(Math.random()*2000));

	// Hide 'Demo Mode' button and the seperator near it
	$("#power_options_divider").hide();
	$("#demo_mode_button").hide();

	// Icing on the cake
	$("#demo_mode_indicator").show();
}
