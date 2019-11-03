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
		$("#sensor_toggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Sensors");
		sensorMode = false;
	} else {
		$("#btm_view_camera").hide();
		$("#btm_view_sensors").show();
		$("#sensor_toggle").html("<i class='fa fa-fw fa-camera'></i> Show Cameras");
		sensorMode = true;
	}
} 

$(document).ready(function () {
	
	// Dark mode toggle handler
	$("#darkmode_toggle").change(function() {
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
	$("#nav_title").click(function () {
		location.reload();
	});

	// Hide demo mode indicator
	$("#demo_mode_indicator").hide();

	// Set to camera view by default
	$("#btm_view_sensors").hide();
	// Allow button to swap between camera and sensors view
	$("#sensor_toggle").click(toggleSensorMode);

	// Clear log dump box
	$("#gamepad_log_clear_button").click(function () {
		$("#gamepad_log_pre").html("");
	});

	// If the camera stream doesn't load, default to fallback image
	$('.stream-image').error(function () {
		if (this.src != 'images/no-feed-small.png') {
			this.src = 'images/no-feed-small.png';
			$('.stream-image').removeClass("rotated");
		}
	});
	// Make the image invisible until it has loaded, allowing us to see the loading spinner
	$('.stream-image').css('opacity', '0');
	// Once it's loaded, hide the spinner and remove transparency
	$('.stream-image').load(function () {
		$("#spinner").hide();
		$('.stream-image').css('opacity', '1');
	});

	// Load demo mode if on public webserver
	$(window).load(function () {
		if (ip == "sfxrescue.github.io" || ip == "www.sfxrescue.com")
			DemoMode();
	});

	// Focus an element in a modal if it is specified
	$(".modal").on('shown.bs.modal', function () {
		$("#" + this.getAttribute("focus")).focus();
	});
  
	$('.camera-refresh-button').click(function() {
		let stream = $(this).closest('.camera-container').find('.stream-image');
		let cameraId = $(this).closest('.camera-container').find('.stream-image').attr("id");
		stream.attr('src', 'http://' + ip + ':8081/' + cameraId + '/stream/' + Math.random());
	});
	
	$('.camera-screenshot-button').click(function() {
		let cameraId = $(this).closest('.camera-container').find('.stream-image').attr("id");
		let container = $(this).closest('.camera-container');
		let snapshot_url = demo ? '' : 'http://' + ip + ':8080/' + cameraId + '/action/snapshot';
		$.get(snapshot_url).done(function(){ // When request is done
			setTimeout(function() {          // Give it a bit more time after request
				container.fadeOut(150).fadeIn(150);
				let link = document.createElement('a');
				link.href = 'images/downloads/lastsnap.jpg';
				link.download = 'lastsnap.jpg';
				link.target = "_blank";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			},500);
		});
	});
	
	// Whether the thermal camera is overlayed on the main camera
	var overlayed = false;
	//Swap thermal overlay on click
	$('#thermal_overlay_button').click(function() {
		let opacity = $('#thermal_overlay_opacity').val();
		let xscale = $('#thermal_overlay_xscale').val();
		let yscale = $('#thermal_overlay_yscale').val();
		if(!overlayed) {
			$('#thermal_camera').css({ 'opacity' : opacity });
			$('#camera_front').css({'filter': 'grayscale(100%)'});
			$('#thermal_overlay').append($('#thermal_camera'));
			$('#thermal_overlay_button').toggleClass('fa-rotate-180');
			$('#thermal_overlay_controls').css({'display':'inline'});
			$('#thermal_camera').css({'transform' : 'scale('+xscale+','+yscale+')'});
			overlayed = true;
		}
		else {
			$('#thermal_camera').css({ 'opacity' : 1 });
			$('#thermal_camera_container').append($('#thermal_camera'));
			$('#camera_front').css({'filter': ''});
			$('#thermal_overlay_button').toggleClass('fa-rotate-180');
			$('#thermal_overlay_controls').css({'display':'none'});
			$('#thermal_camera').css({'transform' : 'scale(1,1)'});
			overlayed = false;
		}
		
	});
	
	// Thermal Overlay Settings
	// Opacity slider
	$('#thermal_overlay_opacity').on("input", function() {
		$('#thermal_camera').css({ 'opacity' : $(this).val() });
	}); 
	// Opacity slider reset button
	$('#thermal_overlay_opacity_reset').click(function() {
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
	$('#thermal_overlay_xscale_reset').click(function() {
		$('#thermal_overlay_xscale').val('1');
		let yscale = $('#thermal_overlay_yscale').val();
		$('#thermal_camera').css({'transform' : 'scale(1,'+yscale+')'});
	});
	// Y scale slider reset button
	$('#thermal_overlay_yscale_reset').click(function() {
		$('#thermal_overlay_yscale').val('1');
		let xscale = $('#thermal_overlay_xscale').val();
		$('#thermal_camera').css({'transform' : 'scale('+xscale+', 1)'});
	});

	// Minor compatibility fix for incompatibility fixes
	$("#user_agent").click(function () {
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
