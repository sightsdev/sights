
function DemoMode() {
	document.getElementById("cputemp_level").innerHTML = "45&degC";
	document.getElementById("cputemp_graph").className = "c100 med orange p45";

	document.getElementById("charge_level").innerHTML = "97%";
	document.getElementById("charge_graph").className = "c100 med orange p97";

	document.getElementById("co2_level").innerHTML = "250 ppm";
	document.getElementById("co2_graph").className = "c100 med orange p25";

	document.getElementById("tvoc_level").innerHTML = "75 ppb";
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
		
	var ir_test = [
	  [20, 22, 23, 24, 25, 24, 23, 22],
	  [19, 20, 22, 23, 23, 24, 22, 21],
	  [19, 18, 22, 24, 22, 23, 22, 20],
	  [18, 17, 17, 18, 20, 23, 22, 21],
	  [17, 15, 15, 17, 19, 20, 22, 23],
	  [17, 14, 14, 17, 18, 19, 20, 22],
	  [18, 15, 15, 18, 20, 22, 23, 24],
	  [20, 19, 19, 20, 22, 23, 24, 25]
	];
	for (i = 0; i < 8; i++) {
		for (j = 0; j < 8; j++) {
			var offset = i * 8 + j;
			var pixel = ir_test[i][j];
			document.getElementById("p" + (offset + 1)).style = "background:" + rainbow(pixel);
		}
	}
}