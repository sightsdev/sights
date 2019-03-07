
function DemoMode() {
	document.getElementById("cputemp_level").innerHTML = "45&degC";
	document.getElementById("cputemp_graph").className = "c100 med orange p45";

	document.getElementById("charge_level").innerHTML = "97%";
	document.getElementById("charge_graph").className = "c100 med orange p97";

	document.getElementById("co2_level").innerHTML = "250<span style='font-size: 10px'> ppm</span>";
	document.getElementById("co2_graph").className = "c100 med orange p25";

	document.getElementById("tvoc_level").innerHTML = "75<span style='font-size: 10px'> ppb</span>";
	document.getElementById("tvoc_graph").className = "c100 med orange p14";
		
	distChartData.datasets[0].data = [768, 128, 256, 312];
	distChart.update();

	tempChartData.datasets[0].data = [12,12,12,14];
	tempChartData.datasets[1].data = [45,48,45,40];
	tempChartData.datasets[2].data = [45,54,32,32];
	tempChartData.datasets[3].data = [18,19,23,19];
	tempChartData.labels = [];
	for (var i = 0; i < tempChartData.datasets[0].data.length; i++) {
		tempChartData.labels.push(i);
	}
	tempChart.update();

	var elements = document.getElementsByClassName('streamImage');

	for (var i = 0; i < elements.length; i++)
		elements[i].src = 'images/demo_' + elements[i].id + '.jpg'; 
		
	var example_thermal_camera_data = [
		25.75, 26.50, 25.75, 26.00, 25.25, 24.75, 25.25, 24.75, 
		25.75, 25.25, 25.50, 25.50, 26.50, 26.00, 27.00, 25.00, 
		26.00, 25.75, 27.00, 29.00, 29.50, 28.00, 26.00, 25.25, 
		29.00, 28.75, 26.50, 25.75, 25.25, 25.00, 25.00, 25.25, 
		27.00, 26.00, 25.00, 25.00, 24.75, 24.50, 25.00, 25.50, 
		29.50, 30.50, 25.75, 24.75, 25.00, 25.00, 25.00, 25.25, 
		31.25, 31.00, 27.25, 24.50, 25.50, 25.00, 25.25, 26.75, 
		28.75, 28.25, 26.75, 25.25, 25.50, 25.75, 28.25, 28.25];

	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			var offset = i * 8 + j;
			var pixel = example_thermal_camera_data[offset];
			document.getElementById("p" + (offset + 1)).style = "background:" + rainbow(pixel);
		}
	}
}