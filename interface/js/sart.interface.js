/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
*/

// Shared between all scripts
var ip = window.location.hostname;

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
	$(".modal-dialog").draggable({
		handle: ".modal-header"
	});

	// Reload page when header pressed
	$("#nav_title").click(function () {
		location.reload();
	});

	// Swap between camera and sensors view
	$("#sensorToggle").click(function () {
		$("#btm_view_camera").toggle();
		$("#btm_view_sensors").toggle();
	});

	// Clear log dump box
	$("#gamepad-log-clear-button").click(function () {
		$("#gamepad-log-pre").html("");
	});

	// Select the contents of the dump log box
	$("#gamepad-log-select-button").click(function () {
		// Select the contents of the dump log box
		selectTextInElement('gamepad-log-pre');
	});

	// If the camera stream doesn't load, default to fallback image
	$('.streamImage').error(function () {
		if (this.src != 'images/no-feed-small.png') {
			this.src = 'images/no-feed-small.png';
			$('.streamImage').removeClass("rotated");
		}
	});

	// Set source of camera streams
	$("#camera_front").attr("src", portString(8081));
	$("#camera_back").attr("src", portString(8082));

	// Set source of SSH window
	$("#ssh_iframe").attr("src", portString(4200));

	// Generate thermal camera table
	x = 0;
	var table = $('<table>');
	for (i = 0; i < 24; i++) {
		var row = $('<tr>');
		for (j = 0; j < 32; j++) {
			row.append("<td><div class='content' id=p" + x + "></div></td>");
			x++;
		}
		table.append(row);
	}
	$('#thermal_camera').append(table);
});