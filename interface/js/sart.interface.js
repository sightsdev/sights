/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

// Shared between all scripts
var ip = window.location.hostname;

// Whether interface is in sensor or camera view
var sensorMode = false;

// Load syntax highlighting
hljs.initHighlightingOnLoad();

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
		$("#sensorToggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Sensors");
		sensorMode = false;
	} else {
		$("#btm_view_camera").hide();
		$("#btm_view_sensors").show();
		$("#sensorToggle").html("<i class='fa fa-fw fa-camera'></i> Show Cameras");
		sensorMode = true;
	}
}

function focusSSH() {
	setTimeout(function() {
		$("#ssh_iframe").focus();
	}, 300);
}

$(document).ready(function () {

	// Allow both a tooltip and a modal window on a button
	$('[rel="tooltip"]').tooltip({
		trigger: "hover"
	});
	// Enable tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Reload page when header pressed
	$("#nav_title").click(function () {
		location.reload();
	});

	// Hide demo mode indicator
	$("#demo-mode-indicator").hide();

	// Set to camera view by default
	$("#btm_view_sensors").hide();
	// Allow button to swap between camera and sensors view
	$("#sensorToggle").click(toggleSensorMode);

	// Clear log dump box
	$("#gamepad-log-clear-button").click(function () {
		$("#gamepad-log-pre").html("");
	});

	// Setup button to select the contents of the log box
	$("#gamepad-log-select-button").click(function () {
		selectTextInElement('gamepad-log-pre');
	});
	// Same for config editor
	$("#config-editor-select-button").click(function () {
		selectTextInElement('config-editor-pre');
	});
	
	// If the camera stream doesn't load, default to fallback image
	$('.streamImage').error(function () {
		if (this.src != 'images/no-feed-small.png') {
			this.src = 'images/no-feed-small.png';
			$('.streamImage').removeClass("rotated");
		}
	});
	// Make the image invisible until it has loaded, allowing us to see the loading spinner
	$('.streamImage').css('opacity', '0');
	// Once it's loaded, hide the spinner and remove transparency
	$('.streamImage').load(function () {
		$("#spinner").hide();
		$('.streamImage').css('opacity', '1');
	});

	// Set source of SSH window
	$("#ssh_iframe").attr("src", portString(4200));

	// Load demo mode if on public webserver
	$(window).load(function() {
		if (ip == "sfxrescue.github.io" || ip == "www.sfxrescue.com") 
			DemoMode();
	});
});
