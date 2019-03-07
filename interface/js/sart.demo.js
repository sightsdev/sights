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
	// Distance radial graph
	distChartData.datasets[0].data = [768, 128, 256, 312]; // Four directions
	distChart.update();
	// Temperature history graph
	tempChartData.datasets[0].data = [12,12,12,14,12,12,12,12,13,14,15,14,13,12,12];
	tempChartData.datasets[1].data = [45,48,45,40,40,40,40,39,38,38,38,39,40,39,40];
	tempChartData.datasets[2].data = [45,54,32,32,33,34,35,34,34,34,33,32,32,31,33];
	tempChartData.datasets[3].data = [18,19,23,19,19,19,18,14,15,16,17,16,18,19,20];
	/*tempChartData.labels = [];
	for (var i = 0; i < tempChartData.datasets[0].data.length; i++) {
		tempChartData.labels.push(i);
	}*/
	tempChart.update();

	// Camera streams, load dummy images
	var elements = document.getElementsByClassName('streamImage');
	for (i = 0; i < elements.length; i++)
		elements[i].src = 'images/demo_' + elements[i].id + '.jpg'; 
	
	// Example thermal camera data. This is an actual capture from the device.
	var example_thermal_camera_data = [
		25.75, 26.50, 25.75, 26.00, 25.25, 24.75, 25.25, 24.75, 
		25.75, 25.25, 25.50, 25.50, 26.50, 26.00, 27.00, 25.00, 
		26.00, 25.75, 27.00, 29.00, 29.50, 28.00, 26.00, 25.25, 
		29.00, 28.75, 26.50, 25.75, 25.25, 25.00, 25.00, 25.25, 
		27.00, 26.00, 25.00, 25.00, 24.75, 24.50, 25.00, 25.50, 
		29.50, 30.50, 25.75, 24.75, 25.00, 25.00, 25.00, 25.25, 
		31.25, 31.00, 27.25, 24.50, 25.50, 25.00, 25.25, 26.75, 
		28.75, 28.25, 26.75, 25.25, 25.50, 25.75, 28.25, 28.25];
	// Create pixel grid for thermal camera
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			var offset = i * 8 + j;
			var pixel = example_thermal_camera_data[offset];
			document.getElementById("p" + (offset + 1)).style = "background:" + rainbow(pixel);
		}
	}
}