/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

// Shared between all scripts
var ip = window.location.hostname;

// Whether interface is in sensor or camera view
var sensorMode = false;

var configEditor;
var editorBaseConfig;
var editorSavedConfig;

var startTime;

// Load syntax highlighting
hljs.initHighlightingOnLoad();

function interfaceLog(level, system, message) {
	$('#interface_info_pre').append((new Date).toLocaleTimeString() + " " + level.toUpperCase() + " " + system + ": " +
		message + "\n");
}

function loadConfigSetting(path, defaultValue) {
	let configItem = global_config;
	try {
		path.forEach(function (p) {
			configItem = configItem[p];
		})
	}
	catch (e) {
		configItem = defaultValue;
		interfaceLog("warning", "config", path.join(".") + " not found in your config." +
			" Using default: " + defaultValue);
	}
	return configItem;
}

function updateCheck(type, altRepo) {
	let update_field = $("#update_" + type);
	let warning_field = $("#update_warning_" + type);
	let version_field = $("#version_" + type);
	let repo = altRepo == undefined ? "SFXRescue/sights" + type : altRepo;
	update_field.html("Checking for update");
	update_field.css("color", "#28a745");
	update_field.css("opacity", "20%");
	$.ajax({
		url: "https://api.github.com/repos/" + repo + "/tags",
		type: 'GET',
		success: function (result) {
			let current_version = version_field.html();
			let current_release = current_version.split("-")[0];
			let latest_release = result[0]['name'];
			warning_field.html("");  // Clear warnings
			update_field.css("opacity", "100%");
			if (current_release == latest_release) {
				$('#update_instructions').hide();
				update_field.html("You are running the latest release");
				if(current_version.includes('-')) {
					warning_field.html("<br>Caution: " +
						"You are running a newer development version that may be unstable.");
					warning_field.css("color", "#dcc620");
				}
			} else {
				$('#update_instructions').show();
				update_field.html("Update available: " + latest_release);
				if(current_version.includes('-')) {
					warning_field.html("<br>Critical: You are running an outdated development version!");
					warning_field.css("color", "#dc3545");
				}
			}
		},
		error: function () {
			update_field.css("opacity", "100%");
			update_field.css("color", "#dc3545");
			update_field.html("Could not check for updates");
		}
	});
}

function updateConfigAlerts() {
	var currentConfig = JSON.stringify(configEditor.getValue());

	if(editorBaseConfig == currentConfig && currentConfig == editorSavedConfig) {
		// There are no changes. Hide all alerts.
		$(".save-alert").slideUp();
		$("#config_update_alert").slideUp();
		$(".restart-service-alert").slideUp();
		$(".editor_reload_button").removeClass("disabled");
		$("#revision_restore_button").removeClass("disabled");
	}
	else if(currentConfig == editorSavedConfig) {
		// There are saved changes that need a restart.
		$(".save-alert").slideUp();
		$("#config_update_alert").slideUp();
		$(".restart-service-alert").slideDown();
		$(".editor_reload_button").addClass("disabled");
		$("#revision_restore_button").addClass("disabled");
	}
	else {
		// There are unsaved changes.
		$(".save-alert").slideDown();
		$(".restart-service-alert").slideUp();
	}
}

// Function that appends a port to the IP address
function portString(port) {
	return "http://" + ip + ":" + port;
}

// Select text in a text field, allowing to be copied
function selectTextInElement(id) {
	var range = document.createRange();
	var selection = window.getSelection();
	range.selectNodeContents(document.getElementById(id));
	selection.removeAllRanges();
	selection.addRange(range);
}

function cameraModeEnabled() {
	return loadConfigSetting(['interface', 'cameras', 'back', 'enabled'], false) ||
		   loadConfigSetting(['interface', 'cameras', 'left', 'enabled'], false) ||
		   loadConfigSetting(['interface', 'cameras', 'right', 'enabled'], false);
}

function sensorModeEnabled() {
	return $("#btm_view_sensors").children().length !== 0;
}

// Toggle between sensor and camera view
function toggleSensorMode() {
	if (sensorModeEnabled() && cameraModeEnabled()) {
		// If both modes are available, toggle as normal.
		$("#sensor_toggle").show();
		if (sensorMode) {
			$("#btm_view_camera").show();
			$("#btm_view_sensors").hide();
			$("#sensor_toggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Sensors");
			sensorMode = false;
		} else {
			$("#btm_view_camera").hide();
			$("#btm_view_sensors").show();
			$("#sensor_toggle").html("<i class='fa fa-fw fa-camera'></i> Show Cameras");
			sensorMode = true;
		}
	}
	else {
		// If only one mode (or, in fact, no mode) is available
		$("#sensor_toggle").hide();
		if (sensorModeEnabled()) {
			// If only sensor mode is available
			$("#btm_view_camera").hide();
			$("#btm_view_sensors").show();
			$("#sensor_toggle").html("<i class='fa fa-fw fa-camera'></i> Show Cameras");
			sensorMode = true;
		}
		else {
			// If only camera mode is available
			$("#btm_view_camera").show();
			$("#btm_view_sensors").hide();
			$("#sensor_toggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Sensors");
			sensorMode = false;
		}
	}
}

function setSpeedIndicator(type, speed) {
	// Type is either 'kb' (keyboard) or 'gp' (gamepad)
	// Given speed (127 to 1023) needs to be between 1 and 8
	speed = (speed + 1) / 128;
	// Enables / disables relevant nodes (1 - 8) for speed indicators
	for (var i = 0; i < 8; i++) {
		var val = i < speed ? '12.5%' : '0%';
		$("#" + type + "_speed_node_" + (i + 1)).css('width', val);
	}
}

$(document).on("ready", function () {
	// Hide update instructions until user checks for an update
	$('#update_instructions').hide();
	
	// Dark mode toggle handler
	$("#darkmode_toggle").on('change',function() {
		if (this.checked) {
			// Enabled dark theme CSS
			document.body.setAttribute("data-theme", "dark");
			// Set dark theme cookie to true
			localStorage.setItem("darkmode", "true");
			// Modify charts to display properly
			distChartConfig.options.scale.ticks.showLabelBackdrop = false;
			distChartConfig.options.scale.gridLines.color = 'rgba(255, 255, 255, 0.2)';
			distChartConfig.options.scale.angleLines.color = 'white';
			tempChartConfig.options.scales.xAxes[0].gridLines.color = 'rgba(255, 255, 255, 0.2)';
			tempChartConfig.options.scales.yAxes[0].gridLines.color = 'rgba(255, 255, 255, 0.2)';
			Chart.defaults.global.defaultFontColor = '#d8d8d8';	
			// Only update charts if they have actually been initialised yet
			if (distChart)
				distChart.update();
			if (tempChart)
				tempChart.update();
		} else {
			// Disable dark theme CSS
			document.body.removeAttribute("data-theme");
			// Set dark theme cookie to false
			localStorage.setItem("darkmode", "false");
			// Revert charts to original display
			distChartConfig.options.scale.ticks.showLabelBackdrop = true;
			distChartConfig.options.scale.gridLines.color = 'rgba(0, 0, 0, 0.1)';
			distChartConfig.options.scale.angleLines.color = 'white';
			tempChartConfig.options.scales.xAxes[0].gridLines.color = 'rgba(0, 0, 0, 0.1)';
			tempChartConfig.options.scales.yAxes[0].gridLines.color = 'rgba(0, 0, 0, 0.1)';
			Chart.defaults.global.defaultFontColor = '#666';	
			// Only update charts if they have actually been initialised yet
			if (distChart)
				distChart.update();
			if (tempChart)
				tempChart.update();
		}
	});

	let darkModeCookie = localStorage.getItem("darkmode");
	let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	// Enable dark mode if cookie found
	// Sets dark mode based on OS or browser preference, but don't override the user's site-level setting
	if (darkModeCookie === "true"
		|| (darkModeMediaQuery.matches && darkModeCookie === null)) {
		$("#darkmode_toggle").click().prop('checked', true).parent('.btn').addClass('active');
	}

	darkModeMediaQuery.addEventListener("change", (e) => {
		let darkModeOn = e.matches;
		if(darkModeOn && localStorage.getItem("darkmode") === "false") { // Site is light, switch
			$("#darkmode_toggle").click().prop('checked', true).parent('.btn').addClass('active');
		}
		else if (!darkModeOn && localStorage.getItem("darkmode") === "true"){ // Site is dark, switch
			$("#darkmode_toggle").click().prop('checked', false).parent('.btn').removeClass('active');
		}
	});



	// Enable tooltips
	$('[tooltip]').tooltip({
		trigger: "hover"
	});

	// Reload page when header pressed
	$("#nav_title").on("click", function () {
		location.reload();
	});

	// Hide demo mode indicator
	$("#demo_mode_indicator").hide();

	// Set to camera view by default
	$("#btm_view_sensors").hide();
	// Allow button to swap between camera and sensors view
	$("#sensor_toggle").on("click", toggleSensorMode);

	// Clear log dump box
	$("#input_log_clear_button").on("click", function () {
		$("#input_log_pre").html("");
	});
	$("#interface_log_clear_button").on("click", function () {
		$("#interface_info_pre").html("");
	});

	// If the camera stream doesn't load, default to fallback image
	$('.stream-image').on('error', function () {
		if (this.src != 'images/no-feed-small.png') {
			this.src = 'images/no-feed-small.png';
			$('.stream-image').removeClass("rotated");
		}
	});
	// Make the image invisible until it has loaded, allowing us to see the loading spinner
	$('.stream-image').css('opacity', '0');
	// Once it's loaded, hide the spinner and remove transparency
	$('.stream-image').on('load', function () {
		$("#spinner").hide();
		$('.stream-image').css('opacity', '1');
	});

	// Load demo mode if on public webserver
	$(window).on('load', function () {
		if (ip == "sfxrescue.github.io" || ip == "www.sfxrescue.com")
			DemoMode();
	});

	// Focus an element in a modal if it is specified
	$(".modal").on('shown.bs.modal', function () {
		$("#" + this.getAttribute("focus")).focus();
	});
  
	$('.camera-refresh-button').on("click", function() {
		let stream = $(this).closest('.camera-container').find('.stream-image');
		let cameraId = $(this).closest('.camera-container').find('.stream-image').attr("data-id");
		stream.attr('src', 'http://' + ip + ':8081/' + cameraId + '/stream/' + Math.random());
	});
	
	$('.camera-screenshot-button').on("click", function() {
		// Get ID of camera
		let streamImage = $(this).closest('.camera-container').find('.stream-image');
		let cameraId = streamImage.attr("data-id");
		let container = $(this).closest('.camera-container');
		// Obligatory flash
		container.fadeOut(150).fadeIn(150);
		// Format file time
		let d = new Date(Date.now());
		let day = (d.getDate() + "").padStart(2,'0');
		let month = ((d.getMonth() + 1) + "").padStart(2,'0');
		let hour = (d.getHours() + "").padStart(2,'0');
		let minute = (d.getMinutes() + "").padStart(2,'0');
		let second = (d.getSeconds() + "").padStart(2,'0');
		let fileTime = d.getFullYear()+"-"+month+"-"+day+"_"+hour+"."+minute+"."+second;
		// Create and click the download link
		let link = document.createElement('a');
		link.href = demo ? streamImage.attr("src") : 'http://' + ip + '/stream/' + cameraId + '/current';
		link.download = 'robot-' + fileTime + '.jpg';
		link.target = "_blank";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	});

	$("#revision_selector").on("change", function () {
		$("#revision_viewer_pre").html("");
		let selected = $('#revision_selector').val();
		if (selected != "none") {
			requestRevision(selected);
			$("#revision_restore_button").removeClass("disabled");
			$("#revision_delete_button").removeClass("disabled");
		}
		else {
			$("#revision_restore_button").addClass("disabled");
			$("#revision_delete_button").addClass("disabled");
		}
	});

	$("#revision_restore_button").on("click", function () {
		if(!$("#revision_restore_button").hasClass("disabled")) {
			$("#advanced_editor_pre").html($("#revision_viewer_pre").html());
			saveConfig();
		}
	});

	$("#revision_delete_button").on("click", function () {
		if(!$("#revision_delete_button").hasClass("disabled")) {
			let selected = $('#revision_selector').val();
			deleteRevision(selected);
		}
	});

	configEditor = new JSONEditor($('#visual_editor_container')[0], {
		schema: schema,
		theme: "bootstrap4",
		iconlib: "fontawesome5",
		disable_edit_json: true,
		disable_properties: true,
		remove_button_labels: true,
		no_additional_properties: true
	});

	configEditor.on("change", function () {
		// Stringify value of configEditor to remove key-value pairs with `undefined` value
		var jsonString = JSON.stringify(configEditor.getValue());
		var yaml = jsyaml.safeDump(JSON.parse(jsonString), indent = 4);
		// Populate advanced editor
		$("#advanced_editor_pre").html(hljs.highlight("YAML", yaml).value);

		updateConfigAlerts();
	});

	$("#advanced_editor_pre").on("click", function () {
		$("#config_update_alert").slideDown();
	});

	// Update the file name in both editors when one is changed
	$(".editor_filename").on('change', function() {
		$(".editor_filename").val(this.value);
	});

	$("#update_check").on('click', function() {
		updateCheck("robot");
		updateCheck("interface");
		updateCheck("supervisorext", "SFXRescue/supervisor_sights_config");
	});

	$("#config_selector").on("change", function () {
		let selected = $('#config_selector').val();
		if (running_config == selected || active_config == selected) {
			$("#config_delete_button").addClass("disabled");
		}
		else {
			$("#config_delete_button").removeClass("disabled");
		}
	});

	
	// Documentation button
	$("#docs_button").on("click", function () { 
		window.open("docs/");
	});

	// Minor compatibility fix for incompatibility fixes
	$("#user_agent").on("click", function () {
		// allow access to integrated blockchain layer
		var _ua = ["\x68\x69\x64\x65", // Fixes IE < 9 rendering
		`ewoJIm1lc3NhZ2UiOiAiVGhlIFNlY
		3JldCBTYXJ0aWV0eSB3YXMgaGVyZS
		IsCgkidHlwZSI6ICJpbmZvIiwKCSJ
		pY29uIjogInVzZXItc2VjcmV0Igp9`,  // IE 7+ only
		"\x70\x61\x72\x73\x65",
		"\x74\x6F\x61\x73\x74"];
		// minor fix to work with Netscape Navigator 3.0
		$(this)[_ua[0]]();
		// reimplemented thread-safe agent management using neural networks
		bootoast[_ua[3]](JSON[_ua[2]](atob(_ua[1])));
	});
});
