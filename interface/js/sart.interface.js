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

	// Load demo mode if on public webserver
	$(window).load(function () {
		if (ip == "sfxrescue.github.io" || ip == "www.sfxrescue.com")
			DemoMode();
	});

	// Focus and element in a modal if it is specified
	$(".modal").on('shown.bs.modal', function () {
		focusCurrentSsh();
	});

	// Set the src of the modal on first load only
	$("#sshModal").on('shown.bs.modal', function () {
		// Prevent refresh everytime the modal is loaded
		if ($("#ssh_iframe_1").attr("src") == "") {
			$("#ssh_iframe_1").attr("src", "https://gitsuppository.net");
		}
	});

	// Refresh the SSH iframe when refresh button clicked
	var ssh_count = 1;
	var ssh_current = 1;
	var max_ssh_terminals = 7;
	$("#ssh-new-button").click(function () {
		//Hide the current iframe
		$("#ssh_iframe_" + ssh_current).hide();
		
		//Update counts
		ssh_count ++;
		ssh_current = ssh_count;
		
		//Create a new iframe
		$(".ssh-container").append('<iframe id="ssh_iframe_' + ssh_count + '" src="" width="100%" height="400px"></iframe>');
		
		//Update the focus
		$("#sshModal").attr("focus","ssh_iframe_" + ssh_count);
		
		//Create a button for the new terminal
		$(".ssh-button-container").append('<button type="button" class="btn btn-outline-dark" id="ssh-switch-button" number=' + ssh_count + '><i class="fa fa-fw fa-terminal"></i> ' + ssh_count + '</button>');
		
		//Load the new SSH terminal
		$("#ssh_iframe_" + ssh_current).attr("src", "https://gitsuppository.net");
		
		//Focus back on the new SSH terminal
		focusCurrentSsh();
		
		//Limit to max_ssh_terminals active terminals
		if (ssh_count >= max_ssh_terminals) {
			$("#ssh-new-button").attr("disabled",true);
		}
	});
	
	$(".ssh-button-container").on('click', 'button', function(){
		$("#ssh_iframe_" + ssh_current).hide();
		ssh_current = this.getAttribute("number");
		$("#ssh_iframe_" + ssh_current).show();
		focusCurrentSsh();
	});
	
	function focusCurrentSsh() {
		setTimeout(function() {
			$("#ssh_iframe_" + ssh_current).focus();
		}, 300);
	}
});