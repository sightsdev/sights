// Populate SARTInterface with dummy data to demonstrate what a functional setup looks like
function DemoMode() {
	// CPU temp graph
	$("#cputemp_level").html("45&degC");
	$("#cputemp_graph").attr('class', "c100 med orange p45");
	// Charge level
	$("#charge_level").html("97%");
	$("#charge_graph").attr('class', "c100 med orange p97");
	// CO2 level
	$("#co2_level").html("250<span style='font-size: 10px'> ppm</span>");
	$("#co2_graph").attr('class', "c100 med orange p25");
	// TVOC level
	$("#tvoc_level").html("75<span style='font-size: 10px'> ppb</span>");
	$("#tvoc_graph").attr('class', "c100 med orange p14");
	// Temperature history graph
	tempChartData.datasets[0].data = [22, 22, 22, 24, 22, 24, 28, 29, 27, 24, 25, 24, 23, 22, 22];
	tempChart.update();

	// Camera streams, load dummy images
	$('.streamImage').each(function (index, value) {
		value.src = 'images/demo_' + value.id + '.jpg';
		value.className = "streamImage";
	});
	
	// SSH modal needs some content
	$("#ssh_iframe").attr('src', 'https://gitsuppository.net/');

	// Uptime
	$("#uptime").html("Uptime: 4:18:22");

	// Create example pixel grid for thermal camera
	for (i = 0; i < 24; i++) {
		for (j = 0; j < 32; j++) {
			var offset = i * 32 + j;
			var pixel = 20 + i;
			// Also cool:
			//var pixel = 24 + i * j;
			$("#p" + offset).css("background", rainbow(pixel));
		}
	}

	$("#controller-status-connected").show();
	$("#controller-status-disconnected").hide();

	bootoast.toast({
		"message": "Controller connected",
		"icon": "gamepad",
		"type": "success",
		"position": "left-bottom"
	});

	$('#gamepadSelect').html('<option value="0" id="gamepad">Xbox 360 Controller</option>');

	$("#robot_status").html("<i class='fa fa-fw fa-link'></i>");
	$("#robot_status").attr("class", "btn btn-success");

	bootoast.toast({
		"message": "Connected to robot",
		"icon": "link",
		"type": "success",
		"position": "left-bottom"
	});
}