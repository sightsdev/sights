/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
*/

// Shared between all scripts
var ip = window.location.hostname;

var sensorMode = false;

// Load syntax highlighting
hljs.initHighlightingOnLoad();

// Function that appends a port to the IP address
function portString(port) {
	return "http://" + ip + ":" + port;
}

function selectTextInElement(id) {
	var range = document.createRange();
	var selection = window.getSelection();
	range.selectNodeContents(document.getElementById(id));
	selection.removeAllRanges();
	selection.addRange(range);
}

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

$(document).ready(function () {

	// Allow both a tooltip and a modal window on a button
	$('[rel="tooltip"]').tooltip({
		trigger: "hover"
	});

	// Enable tooltips
	$('[data-toggle="tooltip"]').tooltip()

	// Set to camera view by default
	$("#btm_view_sensors").toggle(false);

	// Allow modals to be draggable
	/*$(".modal-dialog").draggable({
		handle: ".modal-header"
	});*/

	// Reload page when header pressed
	$("#nav_title").click(function () {
		location.reload();
	});

	// Swap between camera and sensors view
	$("#sensorToggle").click(toggleSensorMode);

	// Clear log dump box
	$("#gamepad-log-clear-button").click(function () {
		$("#gamepad-log-pre").html("");
	});

	// Select the contents of the dump log box
	$("#gamepad-log-select-button").click(function () {
		// Select the contents of the dump log box
		selectTextInElement('gamepad-log-pre');
	});
	$("#config-editor-select-button").click(function () {
		// Select the contents of the dump log box
		selectTextInElement('config-editor-pre');
	});

	// If the camera stream doesn't load, default to fallback image
	$('.streamImage').error(function () {
		if (this.src != 'images/no-feed-small.png') {
			this.src = 'images/no-feed-small.png';
			$('.streamImage').removeClass("rotated");
		}
	});
	$('.streamImage').css('opacity', '0');
	$('.streamImage').load(function () {
		$("#spinner").hide();
		$('.streamImage').css('opacity', '1');
	})

	// Set source of camera streams
	$("#camera_front").attr("src", portString(8081));
	$("#camera_back").attr("src", portString(8082));
	$("#camera_left").attr("src", portString(8083));
	$("#camera_right").attr("src", portString(8084));

	// Set source of SSH window
	$("#ssh_iframe").attr("src", portString(4200));
});