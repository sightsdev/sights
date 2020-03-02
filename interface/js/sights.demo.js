/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/
var demo = false;
var demo_config = {"network":{"ip":"*"},"control":{"default_gamepad_speed":3,"default_keyboard_speed":3},"motors":{
	"type":"virtual"},"arduino":{"enabled":false},"interface":{"notifications":{"enabled":true,"timeout":7},"cameras":{
		"front":{"enabled":true,"id":1},"back":{"enabled":true,"id":2},"left":{"enabled":true,"id":3},"right":{
			"enabled":true,"id":4}},"graphs":[{"uid":"cpu_temperature","type":"circle","enabled":true,"location":
				"#left_view_sensors","title":"CPU Temp.","unit":"°C","unit_style":"font-size: 12px;","maximum":100},{
		"uid":"memory_usage","type":"circle","enabled":true,"location":"#left_view_sensors","title":"RAM Usage","unit":
				" MB","unit_style":"font-size: 12px;","maximum":4096},{"uid":"disk_usage","type":"circle","enabled":
				true,"location":"#right_view_sensors","title":"Disk Usage","unit":" GB","unit_style":"font-size: 12px;",
			"maximum":100},{"uid":"cpu_usage","type":"circle","enabled":true,"location":"#right_view_sensors","title":
				"CPU Usage","unit":"%","unit_style":"font-size: 15px;","maximum":100},{"uid":"uptime","type":"uptime",
			"enabled":true,"location":"#textgroup_left","title":"Uptime"},{"uid":"co2_graph","type":"line","enabled":
				true,"location":"#btm_view_sensors","title":"CO2","icon":"cloud","colour_scheme":"summer",
			"x_axis_label":"Time (seconds)","y_axis_label":"CO2 Concentration (ppm)","y_axis_min":300,"y_axis_max":600,
			"period":3},{"uid":"thermal_camera","type":"thermalcamera","enabled":true,"location":"#btm_view_sensors",
			"title":"Thermal Camera","width":32,"height":24,"camera":"default","opacity":25,"xscale":100,"yscale":100},{
		"uid":"ambient_temp","type":"line","enabled":true,"location":"#btm_view_sensors","title":"Ambient Temperature",
			"icon":"thermometer-half","colour_scheme":"ocean","x_axis_label":"Time (s)","y_axis_label":
				"Temperature (°C)","period":3}]},"sensors":[{"enabled":true,"type":"random","name":"demo_cpu_temp",
		"period":3,"min":50,"max":55,"display_on":["cpu_temperature"]},{"enabled":true,"type":"random","name":
			"demo_memory_usage","period":3,"min":175,"max":225,"display_on":["memory_usage"]},{"enabled":true,"type":
			"random","name":"demo_disk_usage","period":60,"min":10,"max":10,"display_on":["disk_usage"]},{"enabled":true,
		"type":"random","name":"demo_cpu_usage","period":1,"min":2,"max":10,"display_on":["cpu_usage"]},{"enabled":true,
		"type":"random","name":"Internal","period":3,"min":45,"max":50,"display_on":["ambient_temp"]},{"enabled":true,
		"type":"random","name":"External","period":3,"min":25,"max":30,"display_on":["ambient_temp"]},{"enabled":true,
		"type":"random","name":"CO2 Level","period":3,"min":450,"max":500,"display_on":["co2_graph"]},{"enabled":true,
		"type":"fancy","name":"Thermal Camera","period":0.1,"display_on":["thermal_camera"]}],"debug":{"log_level":
			"info","print_messages":false}};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Populate interface with dummy data to demonstrate what a functional setup looks like
function demoMode() {

	// Set demo related global variables
	demo = true;
	running_config = "demo.json";
	ssh_address = "https://gitsuppository.net/";

	// Make sensors.js think that there's a real config running!
	sensorUpdate({
		"initial_message": true,
		"running_config": "demo.json",
		"uptime": 0,
		"version_sights": "Web-based Demo"
	});
	sensorsConnectedAlert();

	let thermal = [244, 246, 248, 250, 252, 252, 251, 253, 251, 250, 248, 248, 247, 247, 247, 246, 246, 246, 246, 246, 246, 246, 246, 246, 248, 248, 249, 248, 249, 249, 250, 249, 235, 241, 244, 245, 245, 244, 244, 245, 244, 243, 243, 243, 241, 239, 239, 240, 241, 240, 238, 238, 239, 239, 240, 242, 243, 243, 243, 243, 242, 243, 243, 244, 222, 230, 236, 235, 234, 235, 235, 236, 234, 232, 232, 228, 226, 226, 226, 226, 226, 225, 225, 226, 225, 224, 226, 227, 229, 229, 229, 229, 231, 230, 231, 231, 212, 218, 221, 221, 222, 223, 223, 222, 220, 219, 219, 218, 215, 216, 216, 214, 213, 216, 216, 215, 217, 216, 216, 216, 216, 217, 219, 219, 218, 219, 220, 220, 204, 210, 213, 212, 212, 214, 213, 212, 211, 210, 210, 208, 206, 207, 170, 26, 169, 205, 207, 206, 206, 206, 207, 208, 207, 206, 209, 210, 209, 209, 211, 210, 193, 199, 202, 201, 202, 203, 203, 201, 199, 200, 200, 196, 198, 184, 88, 9, 129, 191, 197, 195, 194, 194, 196, 196, 195, 195, 198, 198, 196, 196, 200, 198, 182, 188, 192, 191, 189, 192, 193, 190, 186, 188, 188, 185, 181, 68, 9, 11, 156, 181, 183, 179, 179, 181, 184, 183, 182, 183, 184, 184, 182, 182, 187, 185, 167, 173, 177, 177, 174, 179, 178, 173, 171, 173, 172, 168, 158, 21, 10, 8, 89, 169, 168, 164, 164, 166, 167, 167, 166, 166, 170, 169, 168, 169, 174, 172, 149, 155, 158, 157, 155, 160, 162, 156, 155, 158, 157, 154, 145, 14, 0, 2, 27, 129, 150, 146, 147, 148, 151, 151, 152, 151, 154, 153, 152, 156, 159, 158, 125, 135, 138, 136, 136, 144, 144, 135, 137, 139, 138, 132, 125, 98, 7, 360, 18, 107, 132, 127, 127, 128, 130, 126, 127, 133, 137, 132, 130, 136, 141, 146, 120, 120, 121, 121, 120, 122, 122, 121, 121, 121, 121, 120, 121, 51, 8, 2, 62, 39, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 127, 149, 120, 120, 120, 120, 120, 120, 120, 119, 120, 120, 120, 119, 120, 102, 0, 0, 61, 118, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 139, 119, 120, 119, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 19, 0, 81, 120, 120, 120, 120, 120, 119, 120, 120, 120, 120, 120, 120, 120, 121, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 121, 120, 44, 0, 78, 120, 120, 121, 120, 120, 120, 120, 120, 121, 120, 120, 120, 120, 120, 120, 93, 104, 114, 117, 118, 120, 119, 119, 120, 119, 118, 117, 119, 107, 2, 1, 79, 111, 116, 116, 120, 115, 117, 117, 112, 104, 116, 119, 120, 120, 120, 120, 72, 79, 88, 89, 89, 92, 90, 91, 90, 90, 91, 89, 91, 28, 7, 10, 74, 83, 85, 86, 90, 89, 85, 78, 51, 58, 87, 91, 110, 106, 104, 97, 60, 67, 71, 75, 77, 77, 74, 77, 78, 76, 75, 74, 73, 5, 15, 35, 72, 74, 74, 76, 77, 74, 74, 76, 76, 82, 86, 84, 102, 117, 104, 97, 47, 53, 56, 60, 61, 62, 63, 65, 65, 64, 64, 65, 65, 56, 45, 49, 68, 69, 71, 71, 72, 72, 75, 77, 81, 83, 90, 68, 85, 116, 102, 99, 43, 48, 53, 56, 57, 57, 62, 62, 63, 64, 64, 62, 66, 61, 64, 66, 68, 68, 68, 68, 69, 71, 74, 74, 77, 79, 76, 72, 80, 88, 90, 84, 44, 48, 54, 57, 59, 57, 61, 64, 65, 65, 63, 64, 66, 64, 62, 65, 67, 68, 67, 67, 71, 72, 72, 73, 73, 69, 49, 54, 73, 81, 82, 79, 43, 48, 54, 56, 58, 58, 61, 62, 64, 62, 62, 65, 65, 65, 63, 67, 70, 70, 70, 71, 71, 71, 70, 70, 73, 72, 61, 54, 70, 78, 81, 82, 38, 42, 51, 56, 58, 57, 59, 61, 61, 59, 60, 63, 64, 64, 63, 64, 67, 67, 66, 69, 70, 69, 69, 71, 71, 64, 61, 56, 67, 76, 81, 81, 36, 41, 50, 55, 56, 55, 57, 58, 59, 57, 60, 66, 65, 64, 62, 60, 62, 62, 59, 63, 63, 63, 64, 65, 62, 49, 51, 60, 61, 71, 74, 77, 32, 39, 47, 53, 56, 55, 57, 56, 56, 56, 61, 64, 60, 57, 54, 53, 56, 57, 56, 59, 59, 58, 59, 63, 52, 45, 41, 52, 63, 71, 73, 73]

	setInterval(function () {
		thermal = thermal.map(function (value) {
			return (value + 10) % 360;
		})
		sensorUpdate({
			"sensor_data" : {
				"fancy_1": thermal
			}
		})
	}, 100);

	function demoSensorUpdate(sensor) {
		let json = {"sensor_data" : {}};
		json["sensor_data"]["random_" + sensor.id] = getRandomInt(sensor.min, sensor.max);
		sensorUpdate(json);
	}

	let randomSensors = 0;
	demo_config.sensors.forEach(function (sensor) {
		if (sensor.type == "random") {
			randomSensors = randomSensors + 1;
			sensor.id = randomSensors;
			demoSensorUpdate(sensor);
			setInterval(function () {
				demoSensorUpdate(sensor)
			}, sensor.period * 1000)
		}
	});

	// Set demo camera images
	let imageSets = 9; // Number of sets of images in images/demo_camera
	let set = Math.floor(Math.random() * imageSets);
	$('.stream-image').each(function () {
		let id = $(this).attr("id");
		let src = "images/demo_camera/set-" + set + "/" + id + ".jpg";
		$(this).attr('src', src);
		$(this).attr('refresh_src', src);
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
	$('#gamepad_monitor_pre').html(hljs.highlight("JSON", JSON.stringify(obj, null, '\t')).value);

	let demo_keyboard_speed = 3;
	keyboardJS.bind('-', null, function (e) {
		// Keep speed at a minimum of 1
		demo_keyboard_speed = Math.max(1, demo_keyboard_speed - 1);
		setSpeedIndicator("kb", demo_keyboard_speed);
	});

	keyboardJS.bind('=', null, function (e) {
		// Keep speed at a max of 8
		demo_keyboard_speed = Math.min(8, demo_keyboard_speed + 1);
		setSpeedIndicator("kb", demo_keyboard_speed);
	});

	var example_log = `2019-11-09 13:37:04,068 INFO __main__: Starting manager process
	2019-11-09 13:37:04,069 INFO __main__: Using config file: configs/demo.json
	2019-11-09 13:37:04,071 INFO __main__: PID 289
	2019-11-09 13:37:04,072 INFO motors: Opening motor connection of type: virtual
	2019-11-09 13:37:04,084 INFO sensor_stream: Starting SensorStream-1 process at *:5556
	2019-11-09 13:37:04,088 INFO control_receiver: Starting ControlReceiver-2 process at *:5555
	2019-11-09 13:37:04,320 INFO sensor_stream: Client connected
	2019-11-09 13:37:04,321 INFO sensor_stream: Sent initial message`.replace(/\t+/g, "");

	// Stop updateService from being run every half second
	clearInterval(serviceUpdater);
	// Update service info stuff
	$("#service_info_status").attr("data-original-title", "Service running");
	$("#service_info_status").removeClass("btn-success btn-danger btn-warning btn-secondary").addClass("btn-success");
	$("#service_info_status").attr("data-state", "RUNNING");

	$('#config_selector').html("");
	// Config status indicator style
	$("#config_status").removeClass("btn-success btn-danger btn-warning btn-secondary");
	$("#config_status").addClass("btn-success");
	$("#config_status").attr("data-original-title", "This is the active config file");
	$("#config_active_indicator").html("demo.json");
	// Populate config selector
	$('#config_selector').append('<div class="btn-group float-right" data-file="dynamixel.json">\
		<a href="#" class="dropdown-item text-monospace config-item-button" style="display:block;">dynamixel.json</a>\
		<a href="#" class="dropdown-item config-delete-button" style="display:block;" data-file="dynamixel.json"><i class="fa fa-fw fa-trash-alt"></i></a>\
		</div>'
	);
	$('#config_selector').append('<div class="btn-group float-right" data-file="serial.json">\
		<a href="#" class="dropdown-item text-monospace config-item-button" style="display:block;">serial.json</a>\
		<a href="#" class="dropdown-item config-delete-button" style="display:block;" data-file="serial.json"><i class="fa fa-fw fa-trash-alt"></i></a>\
		</div>'
	);
	$('#config_selector').append('<div class="btn-group float-right" data-file="demo.json">\
		<a href="#" class="dropdown-item text-monospace config-item-button disabled" style="display:block;">demo.json</a>\
		<a href="#" class="dropdown-item config-delete-button disabled" style="display:block;" data-file="demo.json"><i class="fa fa-fw fa-trash-alt"></i></a>\
		</div>'
	);
	$("#current_config").html("demo.json");

	// Update log modal
	$("#service_info_logfile").html("/opt/sights/sights.log");
	$("#service_info_pre").html(hljs.highlight("YAML", example_log).value);

	$("#docs_button").unbind('click').on("click", function () {
		window.open("https://sfxrescue.github.io/sights/");
	});

	// After the sensor socket has connected
	setTimeout(function () {
		// After the control socket has connected
		setTimeout(function () {
			controlConnectedAlert();
		}, Math.ceil(Math.random() * 2000));

		// Hide 'Demo Mode' button and the separator near it
		$("#power_options_divider").hide();
		$("#demo_mode_button").hide();

		// Icing on the cake
		$("#demo_mode_indicator").show();
	});
}
