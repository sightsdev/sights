/*
	Created by the Semi-Autonomous Rescue Team
	Licensed under GNU General Public License 3.0
	
*/

// Shared between all scripts
var ip = window.location.hostname;

// Load syntax highlighting
hljs.initHighlightingOnLoad();

// Function that appends a port to the IP address
function portString (port) {
	return "http://" + ip + ":" + port;
}

$(document).ready(function(){
	
	// Allow both a tooltip and a modal window on a button
	$('[rel="tooltip"]').tooltip({trigger: "hover"});
	// Enable tooltips
	$('[data-toggle="tooltip"]').tooltip()
	
	// Set to four camera view by default
	$("#btm_view_sensors").toggle(false);
	
	// Allow modals to be draggable
	$(".modal-dialog").draggable({
		handle: ".modal-header"
	});
	
	$("#nav_title").click(function() {
		// Reload page
		location.reload();
	});
	
	$("#sensorToggle").click(function() {
		// Swap between camera and sensors view
		$("#btm_view_camera" ).toggle();
		$("#btm_view_sensors" ).toggle();
	});
	
	$("#log_clear").click(function() {
	  // Clear log dump box
	  $("#dump_box").html("");
	});
	$("#sensor_dump_button").click(function() {
	  // Convert sensor data object to JSON (with formatting) and then into syntax highlighted HTML
	  $("#dump_box").html(hljs.highlight("JSON", JSON.stringify(last_sensor_data, null, "\t")).value);
	  
	});
	$("#controller_dump_button").click(function() {
	  // Convert controller data object to JSON (with formatting) and then into syntax highlighted HTML
	  $("#dump_box").html(hljs.highlight("JSON", JSON.stringify(controller_message, null, "\t")).value);
	});
	
	$("#select_log_button").click(function() {
		// Select the contents of the dump log box
		var range = document.createRange();
		var selection = window.getSelection();
		range.selectNodeContents(document.getElementById('dump_box'));
		selection.removeAllRanges();
		selection.addRange(range);
	});
	
	$('.streamImage').error(function(){
		// If the camera stream doesn't load, default to fallback image
		if (this.src != 'images/no-feed-small.png') this.src = 'images/no-feed-small.png';  
	});
	// Set source of camera streams
	$("#camera_front").attr("src", portString(8084));
	$("#camera_left").attr("src", portString(8083));
	$("#camera_right").attr("src", portString(8082));
	$("#camera_back").attr("src", portString(8081));
	// Set source of SSH window
	$("#ssh_iframe").attr("src", portString(4200));
});