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
var unsavedChanges;

var startTime;

// Notify on refresh when there are unsaved changes
window.addEventListener("beforeunload", function (event) {
	if (unsavedChanges) {
		event.returnValue = "We just need to return any value to show a pop-up confirmation to leave the page";
	}
});

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
	let repo = altRepo == undefined ? "SFXRescue/" + type : altRepo;
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
				update_field.html("You are running the latest versioned release");
				if(current_version.includes('-')) {
					warning_field.html("<br>Caution: " +
						"You are running a newer development build that may be unstable.");
					warning_field.css("color", "#dcc620");
				}
			} else {
				$('#update_instructions').show();
				update_field.html("Update available: " + latest_release);
				if(current_version.includes('-')) {
					warning_field.html("<br>Critical: You are running an outdated development build. Please update!");
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
	let currentConfig = JSON.stringify(configEditor.getValue());
	unsavedChanges = false;
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
		unsavedChanges = true;
	}
}

function applyConfig(response) {
	// Certain tasks that should always take place when a config is received, regardless of whether the config was
	// requested by the user or the interface, or if the service is online or offline
	configReceivedAlert();
	configEditor.setValue(response);
	// Keep a copy to track changes
    editorBaseConfig = JSON.stringify(configEditor.getValue());
    editorSavedConfig = editorBaseConfig;
    // Stringify value of new config to remove key-value pairs with `undefined` value
	let jsonString = JSON.stringify(response);
	// Set advanced editor
	let yaml = jsyaml.safeDump(JSON.parse(jsonString), indent = 4);
	// Populate advanced editor
	$("#advanced_editor_pre").html(hljs.highlight("YAML", yaml).value);
	// Manually set output text of range slider elements
	$('output', $('#visual_editor_container'))[0].innerText = response['control']['default_speed'];
	updateConfigAlerts();
}

// Function that appends a port to the IP address
function portString(port) {
	return "http://" + ip + ":" + port;
}

// Select text in a text field, allowing to be copied
function selectTextInElement(id) {
	let range = document.createRange();
	let selection = window.getSelection();
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
		else if (cameraModeEnabled()){
			// If only camera mode is available
			$("#btm_view_camera").show();
			$("#btm_view_sensors").hide();
			$("#sensor_toggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Sensors");
			sensorMode = false;
		}
		else {
			$("#btm_view_sensors").hide();
			$("#btm_view_camera").hide();
			$("#sensor_toggle").hide();
		}
	}
}

function setSpeedIndicator(speed) {
	// Given speed (127 to 1023) needs to be between 1 and 8
	speed = (speed + 1) / 128;
	// Enables / disables relevant nodes (1 - 8) for speed indicators
	for (let i = 0; i < 8; i++) {
		let val = i < speed ? '12.5%' : '0%';
		$("#speed_node_" + (i + 1)).css('width', val);
	}
}

$(document).on("ready", function () {
	// Notify the user as soon as they close the settings modal that there are unsaved changes
	$('#settings_modal').on('hidden.bs.modal', function () {
		if (unsavedChanges) {
			configUnsavedChangesAlert();
		}
	});

    $("#speed_down").on("click", function () {
        keyboardJS.pressKey('-');
        keyboardJS.releaseKey('-');
    });
    $("#speed_up").on("click", function () {
        keyboardJS.pressKey('=');
        keyboardJS.releaseKey('=');
    });
	toggleSensorMode();
	// Hide update instructions until user checks for an update
	$('#update_instructions').hide();
	
	// Dark mode toggle handler
	$("#darkmode_toggle").on('change',function () {
		if (this.checked) {
			// Enabled dark theme CSS
			document.body.setAttribute("data-theme", "dark");
			// Set dark theme cookie to true
			localStorage.setItem("darkmode", "true");
			// Modify charts to display properly
			Chart.defaults.global.defaultFontColor = '#d8d8d8';
		} else {
			// Disable dark theme CSS
			document.body.removeAttribute("data-theme");
			// Set dark theme cookie to false
			localStorage.setItem("darkmode", "false");
			// Revert charts to original display
			Chart.defaults.global.defaultFontColor = '#666';
		}
	});

	let darkModeCookie = localStorage.getItem("darkmode");
	let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	// Enable dark mode if cookie found
	// Sets dark mode based on OS or browser preference, but don't override the user's site-level setting
	if (darkModeCookie === "true"
		|| (darkModeMediaQuery.matches && darkModeCookie === null)) {
		$("#darkmode_toggle").trigger("click").prop('checked', true).parent('.btn').addClass('active');
	}

	darkModeMediaQuery.addEventListener("change", (e) => {
		let darkModeOn = e.matches;
		if(darkModeOn && localStorage.getItem("darkmode") === "false") { // Site is light, switch
			$("#darkmode_toggle").trigger("click").prop('checked', true).parent('.btn').addClass('active');
		}
		else if (!darkModeOn && localStorage.getItem("darkmode") === "true"){ // Site is dark, switch
			$("#darkmode_toggle").trigger("click").prop('checked', false).parent('.btn').removeClass('active');
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

	// Load no-feed.svg and append to .no-feed divs
	$('.no-feed').load('images/no-feed.svg');
	$('.no-feed-sights').load('images/no-feed-sights.svg');
	// Make the image invisible until it has loaded, allowing us to see the fallback image
	$('.stream-image').css('opacity', '0');
	// Once it's loaded, remove transparency
	$('.stream-image').on('load', function () {
		$(this).css('opacity', '1');
	});
	// If a camera stream fails, change opacity to see the fallback image underneath
	$('.stream-image').on('error', function () {
		$(this).css('opacity', '0');
	});

	// Load demo mode if on public webserver
	$(window).on('load', function () {
		if (ip == "sfxrescue.github.io" || ip == "www.sfxrescue.com")
			demoMode();
	});

	// Focus an element in a modal if it is specified
	$(".modal").on('shown.bs.modal', function () {
		$("#" + this.getAttribute("focus")).focus();
	});
  
	$('.camera-refresh-button').on("click", function () {
		let stream = $(this).closest('.camera-container').find('.stream-image');
		let cameraId = $(this).closest('.camera-container').find('.stream-image').attr("data-id");
		stream.attr('src', 'http://' + ip + ':8081/' + cameraId + '/stream/' + Math.random());
	});
	
	$('.camera-screenshot-button').on("click", function () {
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
		let jsonString = JSON.stringify(configEditor.getValue());
		let yaml = jsyaml.safeDump(JSON.parse(jsonString), indent = 4);
		// Populate advanced editor
		$("#advanced_editor_pre").html(hljs.highlight("YAML", yaml).value);

		updateConfigAlerts();
	});

	$("#advanced_editor_pre").on("click", function () {
		$("#config_update_alert").slideDown();
	});

	// Update the file name in both editors when one is changed
	$(".editor_filename").on('change', function () {
		$(".editor_filename").val(this.value);
	});

	$("#update_check").on('click', function () {
		updateCheck("sights");
		//updateCheck("vision", "SIGHTSVision") // If the vision repository version is one day reported
	});

	
	// Documentation button
	$("#docs_button").on("click", function () { 
		window.open("docs/");
	});

	// Minor compatibility fix for incompatibility fixes
	$("#user_agent").on("click", function () {
		// allow access to integrated blockchain layer
		let _ua = ["\x68\x69\x64\x65", // Fixes IE < 9 rendering
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
