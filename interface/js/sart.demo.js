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

	// Camera streams, load dummy images
	var elements = document.getElementsByClassName('streamImage');
	for (i = 0; i < elements.length; i++)
		elements[i].src = 'images/demo_' + elements[i].id + '.jpg'; 
	
	// Example thermal camera data. This is an actual capture from the device.
	var example_thermal_camera_data = [
	23.87,24.93,23.44,24.67,28.49,18.07,20.66,22.14,23.96,16.65,18.76,26.53,21.48,20.08,28.14,24.16,22.14,15.37,22.11,19.62,26.27,18.7,16.55,28.71,19.05,23.83,18.66,26.2,18.76,27.98,27.67,27.75,25.98,28.83,15.34,15.84,26.58,22.22,17.63,15.6,20.91,26.52,27.87,17.83,26.1,26.6,17.16,17.75,25.11,21.16,16.08,15.89,18.65,17.44,21.93,25.42,23.36,19.35,26.64,17.0,29.33,24.84,18.26,18.43,22.48,16.53,16.92,28.45,26.94,26.78,24.1,29.12,22.08,24.61,21.37,24.91,20.4,20.68,24.62,20.83,28.01,29.15,21.25,16.46,18.03,15.6,15.57,25.32,21.6,29.68,22.52,19.21,23.14,16.33,17.03,15.92,18.44,28.14,21.34,21.26,25.29,15.67,25.2,21.33,28.4,16.54,21.6,20.31,29.5,19.55,15.96,24.18,27.96,25.62,17.23,19.93,26.23,24.41,27.58,29.3,20.5,17.35,26.44,29.66,19.89,24.34,21.81,20.22,26.94,18.98,22.43,25.41,17.98,18.46,20.23,15.46,29.02,24.24,24.45,18.08,21.97,18.16,20.88,24.22,19.12,29.52,24.11,21.53,16.46,23.71,29.07,21.04,27.63,24.78,15.92,29.97,17.48,18.72,28.01,15.73,16.74,19.27,28.36,26.31,23.64,20.48,18.14,21.24,26.66,21.01,25.81,28.44,27.17,23.49,28.66,21.66,22.58,19.01,21.13,15.69,20.9,27.45,26.98,26.57,21.14,28.86,28.4,25.51,22.72,15.64,15.3,28.34,28.09,28.81,16.34,27.95,17.98,19.71,28.08,19.77,23.07,20.83,28.54,25.56,26.92,23.45,18.87,27.65,17.25,19.86,24.82,21.03,29.01,20.69,18.59,26.7,20.48,19.63,18.06,25.71,28.59,15.88,20.37,26.19,20.82,15.15,20.32,23.03,19.26,19.07,23.69,24.07,29.72,23.88,19.61,29.93,15.09,16.11,18.65,20.35,15.3,19.44,20.35,18.45,20.89,23.46,20.92,15.15,29.75,27.63,25.68,15.56,25.01,15.29,23.68,22.99,23.77,19.84,16.7,20.41,17.81,27.84,24.18,25.78,26.93,15.99,18.74,23.89,27.53,16.81,29.94,24.36,28.14,15.23,24.95,19.99,17.98,24.49,16.0,18.3,25.67,17.06,21.6,23.53,26.95,23.04,18.82,15.74,28.44,21.55,20.58,28.54,19.54,20.06,16.63,16.75,17.47,18.25,19.83,18.38,21.0,27.93,27.97,23.78,29.17,15.31,17.23,20.9,24.98,20.68,28.92,25.79,29.67,23.33,29.37,22.59,15.8,16.05,24.3,17.62,28.11,24.03,22.2,27.03,26.77,20.58,25.47,19.75,28.43,24.2,21.66,23.37,18.56,15.95,18.22,17.92,17.83,23.74,27.12,16.33,22.0,27.77,20.13,16.21,26.15,28.71,26.02,26.11,29.3,21.82,18.71,28.11,21.79,17.5,29.85,19.58,19.48,22.24,26.52,15.45,21.4,16.73,19.79,27.31,28.9,25.99,23.09,25.22,21.4,19.11,17.77,16.68,21.0,20.45,17.47,26.07,27.76,21.55,23.24,26.78,23.08,17.67,21.54,26.6,29.04,15.59,24.05,29.13,24.78,25.66,21.59,18.34,25.56,19.34,17.71,27.03,26.45,24.03,15.89,27.71,17.78,22.96,19.82,28.96,21.81,26.24,17.42,16.43,15.41,28.78,28.21,17.48,20.82,15.56,22.04,21.06,17.91,27.31,16.42,17.41,23.35,19.75,16.5,28.13,20.17,17.05,23.37,21.83,26.49,18.54,27.44,21.13,29.84,17.5,22.66,20.7,25.21,24.16,19.93,20.3,22.23,27.2,20.7,17.9,23.03,17.03,24.99,23.93,23.14,28.46,22.92,15.58,29.22,21.1,26.98,19.01,19.45,19.42,26.4,17.87,24.38,26.36,19.07,15.53,28.7,26.45,16.6,24.62,17.71,20.55,16.95,24.38,17.04,22.76,20.2,28.44,23.51,28.68,15.66,28.94,20.27,27.95,29.54,15.6,27.98,17.76,17.1,26.08,27.01,22.51,16.8,15.87,23.5,27.61,17.71,22.44,26.63,21.79,16.53,16.05,23.45,17.49,26.36,25.24,27.07,26.86,19.02,24.56,25.3,19.5,25.88,22.54,22.88,18.45,20.47,27.63,16.85,19.21,23.74,19.87,24.75,23.37,29.85,28.36,16.53,25.09,15.39,25.78,19.02,28.48,28.58,25.85,28.15,17.85,26.95,23.79,25.25,26.13,19.04,23.66,15.34,15.92,29.22,15.58,15.88,16.34,25.45,26.4,22.2,15.96,29.08,29.59,18.7,16.12,22.27,18.37,25.83,17.37,15.79,21.81,26.12,26.19,28.28,20.57,28.12,19.53,22.66,23.75,28.78,15.86,23.07,26.11,22.23,16.79,26.12,22.19,22.07,18.57,24.42,21.54,20.14,17.81,22.49,21.54,25.26,27.14,17.46,23.55,25.4,16.53,21.18,18.98,25.55,25.13,22.84,16.78,26.62,15.29,23.58,26.91,27.11,24.31,15.02,21.49,24.95,27.49,17.96,18.57,16.82,20.71,16.89,18.66,19.11,17.98,24.24,19.74,19.44,26.3,18.55,29.13,26.21,21.95,27.28,24.63,16.38,20.38,15.89,24.94,22.41,25.93,27.5,20.72,16.01,21.39,21.27,25.64,23.49,17.13,23.34,22.43,23.94,21.07,26.0,18.9,17.38,25.52,19.02,20.48,20.21,16.16,28.06,22.54,29.06,19.92,23.96,27.9,28.55,21.0,26.49,21.46,20.69,24.75,15.85,18.47,29.02,16.63,29.36,25.48,23.03,22.02,15.33,22.98,27.8,23.16,16.53,17.61,25.41,16.72,16.19,28.23,18.22,24.29,19.45,28.51,19.31,25.31,18.02,15.74,21.23,20.84,17.02,28.69,17.98,18.49,16.26,29.3,15.02,28.94,21.61,24.53,16.46,29.95,20.08,19.08,26.05,27.75,23.33,16.54,28.26,19.89,20.28,23.4,22.94,15.55,25.79,17.64,25.79,29.08,28.38,16.61,25.77,18.27,26.51,24.82,28.21,22.61,29.52,29.47,25.05,28.55,29.75,18.82,28.34,29.25,18.76,15.2,23.79,16.41,28.09,16.48,16.23,28.5,22.21,27.49,27.79,23.02,27.73,27.11,26.29,22.13,19.12,23.09,17.03,18.94,19.94,25.74,28.97,28.08,16.73,26.37,22.41,20.39,20.25,19.63,20.56,18.91,26.98,19.42]
	
	// Create pixel grid for thermal camera
	for (i = 0; i < 24; i++) {
		for (j = 0; j < 32; j++) {
			var offset = i * 32 + j;
			var pixel = example_thermal_camera_data[offset];
			document.getElementById("p" + offset).style = "background:" + rainbow(pixel);
		}
	}
}