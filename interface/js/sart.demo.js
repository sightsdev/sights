// Populate SARTInterface with dummy data to demonstrate what a functional setup looks like
function DemoMode() {
	// CPU temp graph
	document.getElementById("cputemp_level").innerHTML = "45&degC";
	document.getElementById("cputemp_graph").className = "c100 med orange p45";
	// Charge level
	document.getElementById("charge_level").innerHTML = "97%";
	document.getElementById("charge_graph").className = "c100 med orange p97";
	// CO2 level
	document.getElementById("co2_level").innerHTML = "250<span style='font-size: 10px'> ppm</span>";
	document.getElementById("co2_graph").className = "c100 med orange p25";
	// TVOC level
	document.getElementById("tvoc_level").innerHTML = "75<span style='font-size: 10px'> ppb</span>";
	document.getElementById("tvoc_graph").className = "c100 med orange p14";
	// Temperature history graph
	tempChartData.datasets[0].data = [22,22,22,24,22,24,28,29,27,24,25,24,23,22,22];
	tempChart.update();

	// Camera streams, load dummy images
	var elements = document.getElementsByClassName('streamImage');
	for (i = 0; i < elements.length; i++)
		elements[i].src = 'images/demo_' + elements[i].id + '.jpg'; 
	
	// Create example pixel grid for thermal camera
	for (i = 0; i < 24; i++) {
		for (j = 0; j < 32; j++) {
			var offset = i * 32 + j;
			var pixel = 20 + i;
			// Also cool:
			//var pixel = 24 + i * j;
			document.getElementById("p" + offset).style = "background:" + rainbow(pixel);
		}
	}
	
	$("#controller-status-connected").show();
	$("#controller-status-disconnected").hide();
	
	bootoast.toast({
		"message": "Controller connected",
		"type": "success",
		"position": "left-bottom"
	});
	
	$('#gamepadSelect').html('<option value="0" id="gamepad">Xbox 360 Controller</option>');
	
	$("#robot_status").html("<i class='fa fa-fw fa-link'></i>");
	$("#robot_status").attr("class", "btn btn-success");
	
	bootoast.toast({
		"message": "Connected to robot",
		"type": "success",
		"position": "left-bottom"
	});
}