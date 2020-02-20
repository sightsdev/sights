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
			"random","name":"demo_disk_usage","period":3,"min":10,"max":10,"display_on":["disk_usage"]},{"enabled":true,
		"type":"random","name":"demo_cpu_usage","period":3,"min":2,"max":10,"display_on":["cpu_usage"]},{"enabled":true,
		"type":"random","name":"Internal","period":3,"min":45,"max":50,"display_on":["ambient_temp"]},{"enabled":true,
		"type":"random","name":"External","period":3,"min":25,"max":30,"display_on":["ambient_temp"]},{"enabled":true,
		"type":"random","name":"CO2 Level","period":3,"min":450,"max":500,"display_on":["co2_graph"]},{"enabled":true,
		"type":"fancy","name":"Thermal Camera","period":3,"display_on":["thermal_camera"]}],"debug":{"log_level":
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
		"version_robot": "Web-based Demo",
		"version_interface": "Web-based Demo",
		"version_supervisorext": "Web-based Demo"
	});
	sensorsConnectedAlert();

	sensorUpdate({
		"sensor_data": {
			"fancy_1": [16.26666667, 16.4, 16.53333333, 16.66666667, 16.8, 16.8, 16.73333333, 16.86666667, 16.73333333, 16.66666667, 16.53333333, 16.53333333, 16.46666667, 16.46666667, 16.46666667, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.4, 16.53333333, 16.53333333, 16.6, 16.53333333, 16.6, 16.6, 16.66666667, 16.6, 15.66666667, 16.06666667, 16.26666667, 16.33333333, 16.33333333, 16.26666667, 16.26666667, 16.33333333, 16.26666667, 16.2, 16.2, 16.2, 16.06666667, 15.93333333, 15.93333333, 16, 16.06666667, 16, 15.86666667, 15.86666667, 15.93333333, 15.93333333, 16, 16.13333333, 16.2, 16.2, 16.2, 16.2, 16.13333333, 16.2, 16.2, 16.26666667, 14.8, 15.33333333, 15.73333333, 15.66666667, 15.6, 15.66666667, 15.66666667, 15.73333333, 15.6, 15.46666667, 15.46666667, 15.2, 15.06666667, 15.06666667, 15.06666667, 15.06666667, 15.06666667, 15, 15, 15.06666667, 15, 14.93333333, 15.06666667, 15.13333333, 15.26666667, 15.26666667, 15.26666667, 15.26666667, 15.4, 15.33333333, 15.4, 15.4, 14.13333333, 14.53333333, 14.73333333, 14.73333333, 14.8, 14.86666667, 14.86666667, 14.8, 14.66666667, 14.6, 14.6, 14.53333333, 14.33333333, 14.4, 14.4, 14.26666667, 14.2, 14.4, 14.4, 14.33333333, 14.46666667, 14.4, 14.4, 14.4, 14.4, 14.46666667, 14.6, 14.6, 14.53333333, 14.6, 14.66666667, 14.66666667, 13.6, 14, 14.2, 14.13333333, 14.13333333, 14.26666667, 14.2, 14.13333333, 14.06666667, 14, 14, 13.86666667, 13.73333333, 13.8, 11.33333333, 1.733333333, 11.26666667, 13.66666667, 13.8, 13.73333333, 13.73333333, 13.73333333, 13.8, 13.86666667, 13.8, 13.73333333, 13.93333333, 14, 13.93333333, 13.93333333, 14.06666667, 14, 12.86666667, 13.26666667, 13.46666667, 13.4, 13.46666667, 13.53333333, 13.53333333, 13.4, 13.26666667, 13.33333333, 13.33333333, 13.06666667, 13.2, 12.26666667, 5.866666667, 0.6, 8.6, 12.73333333, 13.13333333, 13, 12.93333333, 12.93333333, 13.06666667, 13.06666667, 13, 13, 13.2, 13.2, 13.06666667, 13.06666667, 13.33333333, 13.2, 12.13333333, 12.53333333, 12.8, 12.73333333, 12.6, 12.8, 12.86666667, 12.66666667, 12.4, 12.53333333, 12.53333333, 12.33333333, 12.06666667, 4.533333333, 0.6, 0.733333333, 10.4, 12.06666667, 12.2, 11.93333333, 11.93333333, 12.06666667, 12.26666667, 12.2, 12.13333333, 12.2, 12.26666667, 12.26666667, 12.13333333, 12.13333333, 12.46666667, 12.33333333, 11.13333333, 11.53333333, 11.8, 11.8, 11.6, 11.93333333, 11.86666667, 11.53333333, 11.4, 11.53333333, 11.46666667, 11.2, 10.53333333, 1.4, 0.666666667, 0.533333333, 5.933333333, 11.26666667, 11.2, 10.93333333, 10.93333333, 11.06666667, 11.13333333, 11.13333333, 11.06666667, 11.06666667, 11.33333333, 11.26666667, 11.2, 11.26666667, 11.6, 11.46666667, 9.933333333, 10.33333333, 10.53333333, 10.46666667, 10.33333333, 10.66666667, 10.8, 10.4, 10.33333333, 10.53333333, 10.46666667, 10.26666667, 9.666666667, 0.933333333, 0, 0.133333333, 1.8, 8.6, 10, 9.733333333, 9.8, 9.866666667, 10.06666667, 10.06666667, 10.13333333, 10.06666667, 10.26666667, 10.2, 10.13333333, 10.4, 10.6, 10.53333333, 8.333333333, 9, 9.2, 9.066666667, 9.066666667, 9.6, 9.6, 9, 9.133333333, 9.266666667, 9.2, 8.8, 8.333333333, 6.533333333, 0.466666667, 24, 1.2, 7.133333333, 8.8, 8.466666667, 8.466666667, 8.533333333, 8.666666667, 8.4, 8.466666667, 8.866666667, 9.133333333, 8.8, 8.666666667, 9.066666667, 9.4, 9.733333333, 8, 8, 8.066666667, 8.066666667, 8, 8.133333333, 8.133333333, 8.066666667, 8.066666667, 8.066666667, 8.066666667, 8, 8.066666667, 3.4, 0.533333333, 0.133333333, 4.133333333, 2.6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8.466666667, 9.933333333, 8, 8, 8, 8, 8, 8, 8, 7.933333333, 8, 8, 8, 7.933333333, 8, 6.8, 0, 0, 4.066666667, 7.866666667, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9.266666667, 7.933333333, 8, 7.933333333, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1.266666667, 0, 5.4, 8, 8, 8, 8, 8, 7.933333333, 8, 8, 8, 8, 8, 8, 8, 8.066666667, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8.066666667, 8, 2.933333333, 0, 5.2, 8, 8, 8.066666667, 8, 8, 8, 8, 8, 8.066666667, 8, 8, 8, 8, 8, 8, 6.2, 6.933333333, 7.6, 7.8, 7.866666667, 8, 7.933333333, 7.933333333, 8, 7.933333333, 7.866666667, 7.8, 7.933333333, 7.133333333, 0.133333333, 0.066666667, 5.266666667, 7.4, 7.733333333, 7.733333333, 8, 7.666666667, 7.8, 7.8, 7.466666667, 6.933333333, 7.733333333, 7.933333333, 8, 8, 8, 8, 4.8, 5.266666667, 5.866666667, 5.933333333, 5.933333333, 6.133333333, 6, 6.066666667, 6, 6, 6.066666667, 5.933333333, 6.066666667, 1.866666667, 0.466666667, 0.666666667, 4.933333333, 5.533333333, 5.666666667, 5.733333333, 6, 5.933333333, 5.666666667, 5.2, 3.4, 3.866666667, 5.8, 6.066666667, 7.333333333, 7.066666667, 6.933333333, 6.466666667, 4, 4.466666667, 4.733333333, 5, 5.133333333, 5.133333333, 4.933333333, 5.133333333, 5.2, 5.066666667, 5, 4.933333333, 4.866666667, 0.333333333, 1, 2.333333333, 4.8, 4.933333333, 4.933333333, 5.066666667, 5.133333333, 4.933333333, 4.933333333, 5.066666667, 5.066666667, 5.466666667, 5.733333333, 5.6, 6.8, 7.8, 6.933333333, 6.466666667, 3.133333333, 3.533333333, 3.733333333, 4, 4.066666667, 4.133333333, 4.2, 4.333333333, 4.333333333, 4.266666667, 4.266666667, 4.333333333, 4.333333333, 3.733333333, 3, 3.266666667, 4.533333333, 4.6, 4.733333333, 4.733333333, 4.8, 4.8, 5, 5.133333333, 5.4, 5.533333333, 6, 4.533333333, 5.666666667, 7.733333333, 6.8, 6.6, 2.866666667, 3.2, 3.533333333, 3.733333333, 3.8, 3.8, 4.133333333, 4.133333333, 4.2, 4.266666667, 4.266666667, 4.133333333, 4.4, 4.066666667, 4.266666667, 4.4, 4.533333333, 4.533333333, 4.533333333, 4.533333333, 4.6, 4.733333333, 4.933333333, 4.933333333, 5.133333333, 5.266666667, 5.066666667, 4.8, 5.333333333, 5.866666667, 6, 5.6, 2.933333333, 3.2, 3.6, 3.8, 3.933333333, 3.8, 4.066666667, 4.266666667, 4.333333333, 4.333333333, 4.2, 4.266666667, 4.4, 4.266666667, 4.133333333, 4.333333333, 4.466666667, 4.533333333, 4.466666667, 4.466666667, 4.733333333, 4.8, 4.8, 4.866666667, 4.866666667, 4.6, 3.266666667, 3.6, 4.866666667, 5.4, 5.466666667, 5.266666667, 2.866666667, 3.2, 3.6, 3.733333333, 3.866666667, 3.866666667, 4.066666667, 4.133333333, 4.266666667, 4.133333333, 4.133333333, 4.333333333, 4.333333333, 4.333333333, 4.2, 4.466666667, 4.666666667, 4.666666667, 4.666666667, 4.733333333, 4.733333333, 4.733333333, 4.666666667, 4.666666667, 4.866666667, 4.8, 4.066666667, 3.6, 4.666666667, 5.2, 5.4, 5.466666667, 2.533333333, 2.8, 3.4, 3.733333333, 3.866666667, 3.8, 3.933333333, 4.066666667, 4.066666667, 3.933333333, 4, 4.2, 4.266666667, 4.266666667, 4.2, 4.266666667, 4.466666667, 4.466666667, 4.4, 4.6, 4.666666667, 4.6, 4.6, 4.733333333, 4.733333333, 4.266666667, 4.066666667, 3.733333333, 4.466666667, 5.066666667, 5.4, 5.4, 2.4, 2.733333333, 3.333333333, 3.666666667, 3.733333333, 3.666666667, 3.8, 3.866666667, 3.933333333, 3.8, 4, 4.4, 4.333333333, 4.266666667, 4.133333333, 4, 4.133333333, 4.133333333, 3.933333333, 4.2, 4.2, 4.2, 4.266666667, 4.333333333, 4.133333333, 3.266666667, 3.4, 4, 4.066666667, 4.733333333, 4.933333333, 5.133333333, 2.133333333, 2.6, 3.133333333, 3.533333333, 3.733333333, 3.666666667, 3.8, 3.733333333, 3.733333333, 3.733333333, 4.066666667, 4.266666667, 4, 3.8, 3.6, 3.533333333, 3.733333333, 3.8, 3.733333333, 3.933333333, 3.933333333, 3.866666667, 3.933333333, 4.2, 3.466666667, 3, 2.733333333, 3.466666667, 4.2, 4.733333333, 4.866666667, 4.866666667]
		}
	});

	setInterval(function () {
		sensorUpdate({
			"sensor_data": {
				"random_1": getRandomInt(50, 55),
				"random_2": getRandomInt(175, 225),
				"random_3": 10,
				"random_4": getRandomInt(2, 10),
				"random_5": getRandomInt(45, 50),
				"random_6": getRandomInt(25, 30),
				"random_7": getRandomInt(450, 500)
			}
		});
	}, 3000);

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
		window.open("https://sfxrescue.github.io/SIGHTSRobot/");
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
