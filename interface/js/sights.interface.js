/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

// Shared between all scripts
var ip = window.location.hostname;

// Whether interface is in sensor or camera view
var sensorMode = false;

var configEditor;
var baseConfig;
var savedConfig;

var startTime;

// Load syntax highlighting
hljs.initHighlightingOnLoad();

function updateCircle(name, value, modifier=1) {
	let level = $("#" + name + "_level");
	let graph = $("#" + name + "_graph");
	let unit = level.attr("unit");
	level.html(value + unit);
	let percent = Math.round(value/modifier);
	if(percent > 100) percent = 100;
	graph.attr('class', "c100 med orange center p" + percent);
}

function updateConfigAlerts() {
	var currentConfig = JSON.stringify(configEditor.getValue());

	if(baseConfig == currentConfig && currentConfig == savedConfig) {
		// There are no changes. Hide all alerts.
		$(".save-alert").slideUp();
		$("#config_update_alert").slideUp();
		$(".restart-service-alert").slideUp();
		$(".editor_reload_button").removeClass("disabled");
	}
	else if(currentConfig == savedConfig) {
		// There are saved changes that need a restart.
		$(".save-alert").slideUp();
		$("#config_update_alert").slideUp();
		$(".restart-service-alert").slideDown();
		$(".editor_reload_button").addClass("disabled");
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

// Toggle between sensor and camera view
function toggleSensorMode() {
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

$(document).on("ready", function () {

	// Uptime updater
	var daySecs = 60*60*24;
	var hourSecs = 60*60;
	var minSecs = 60; // minSecs rhymes with insects
	setInterval(() => {
		if(startTime) {
			// Calculate uptime based on time elapsed since reported time of boot
			let upSeconds = (Date.now() - startTime) / 1000;

			let days = (Math.floor(upSeconds / daySecs) + "").padStart(2, '0');
			let hours = (Math.floor((upSeconds % daySecs) / hourSecs) + "").padStart(2, '0');
			let minutes = (Math.floor(((upSeconds % daySecs) % hourSecs) / minSecs) + "").padStart(2, '0');
			let seconds = (Math.floor(((upSeconds % daySecs) % hourSecs) % minSecs) + "").padStart(2, '0');

			// Format nicely
			$("#uptime").html(days + ":" + hours + ":" + minutes + ":" + seconds);
		}
		else $("#uptime").html("00:00:00:00");
	}, 1000);
	
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



	// Allow both a tooltip and a modal window on a button
	$('[rel="tooltip"]').tooltip({
		trigger: "hover"
	});
	// Enable tooltips
	$('[data-toggle="tooltip"]').tooltip();

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
	$("#gamepad_log_clear_button").on("click", function () {
		$("#gamepad_log_pre").html("");
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
	
	// Whether the thermal camera is overlayed on the main camera
	var overlayed = false;
	//Swap thermal overlay on click
	$('#thermal_overlay_button').on("click", function() {
		let opacity = $('#thermal_overlay_opacity').val();
		let xscale = $('#thermal_overlay_xscale').val();
		let yscale = $('#thermal_overlay_yscale').val();
		if(!overlayed) {
			if($("#camera_front_card").is(":visible")) {
				$('#thermal_camera').css({ 'opacity' : opacity });
				$('#camera_front').css({'filter': 'grayscale(100%)'});
				$('#thermal_overlay').append($('#thermal_camera'));
				$('#thermal_overlay_controls').css({'display':'inline'});
				$('#thermal_camera').css({'transform' : 'scale('+xscale+','+yscale+')'});
			}
			else {
				$('#main_container').append($('#thermal_camera'));
				$('#thermal_camera').css({'width':'500px'})
			}
			$('#thermal_overlay_button').toggleClass('fa-rotate-180');
			overlayed = true;
		}
		else {
			$('#thermal_camera').css({ 'opacity' : 1 });
			$('#thermal_camera_container').append($('#thermal_camera'));
			$('#camera_front').css({'filter': ''});
			$('#thermal_overlay_button').toggleClass('fa-rotate-180');
			$('#thermal_overlay_controls').css({'display':'none'});
			$('#thermal_camera').css({'transform' : 'scale(1,1)'});
			$('#thermal_camera').css({'width':'100%'})
			overlayed = false;
		}
		
	});
	
	// Thermal Overlay Settings
	// Opacity slider
	$('#thermal_overlay_opacity').on("input", function() {
		$('#thermal_camera').css({ 'opacity' : $(this).val() });
	}); 
	// Opacity slider reset button
	$('#thermal_overlay_opacity_reset').on("click", function() {
		$('#thermal_overlay_opacity').val('0.25');
		$('#thermal_camera').css('opacity', '0.25');
	});
	// X and Y scale sliders
	$('.thermal-overlay-scale').on("input", function() {
		let xscale = $('#thermal_overlay_xscale').val();
		let yscale = $('#thermal_overlay_yscale').val();
		$('#thermal_camera').css({'transform' : 'scale('+xscale+','+yscale+')'});
	});
	// X scale slider reset button
	$('#thermal_overlay_xscale_reset').on("click", function() {
		$('#thermal_overlay_xscale').val('1');
		let yscale = $('#thermal_overlay_yscale').val();
		$('#thermal_camera').css({'transform' : 'scale(1,'+yscale+')'});
	});
	// Y scale slider reset button
	$('#thermal_overlay_yscale_reset').on("click", function() {
		$('#thermal_overlay_yscale').val('1');
		let xscale = $('#thermal_overlay_xscale').val();
		$('#thermal_camera').css({'transform' : 'scale('+xscale+', 1)'});
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

	// Update the file name in both editors when one is changed
	$(".editor_filename").on('change', function() {
		$(".editor_filename").val(this.value);
	});
});
