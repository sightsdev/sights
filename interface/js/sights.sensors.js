/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

var sensorSocket;
var running_config;

var graphs = {};
var sensors = {};
var sensorsReady = false;

var global_config;

var tempChart, distChart;

function update_cameras(config) {
	['front', 'left', 'right', 'back'].forEach(function (e) {
		// Get parent div of camera stream image
		var card = $("#camera_" + e + "_card");
		// Enable the div, if camera is enabled in config file
		config[e]['enabled'] ? card.show() : card.hide();
		// Set image attributes to the relevant URL
		let camera = $("#camera_" + e);
		let id = config[e]['id'];
		camera.attr("src", "http://" + ip + ":8081/" + id + "/stream");
		camera.attr("data-id", config[e]['id']);
		$("#sensor_toggle").show();
	});
	if (!config['back']['enabled'] &&
		!config['left']['enabled'] &&
		!config['right']['enabled']) {
		$("#sensor_toggle").hide();
		$("#btm_view_camera").hide();
		$("#btm_view_sensors").show();
		$("#sensor_toggle").html("<i class='fa fa-fw fa-chart-area'></i> Show Cameras");
		sensorMode = true;
	}
}

function sensorConnection() {
	if(!demo) {
		// Start WebSocket receiver
		sensorSocket = new WebSocket("ws://" + ip + ":5556");
		sensorSocket.onopen = function() {
			sensorConnected = true;
			sensorsConnectedAlert();
		};
		sensorSocket.onclose = function() {
			if (sensorConnected) {
				sensorsDisconnectedAlert();
				sensorConnected = false;
			}

			setTimeout(function () {
				sensorConnection()
			}, 5000);
		};
		// Setup update event
		sensorSocket.onmessage = function (event) {
			var obj = JSON.parse(event.data);

			// Update sensor monitor (in log modal)
			$("#sensor_monitor_pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);

			if("initial_message" in obj) {
				requestConfig(function(response) {
					configReceivedAlert();

					// Populate visual editor
					// Populating advanced editor happens on configEditor change, which fires when the inital config is set
					configEditor.setValue(response);
					// Keep a copy to track changes
					baseConfig = JSON.stringify(configEditor.getValue());
					savedConfig = baseConfig;
					updateConfigAlerts();
					// Keep a copy to work from
					global_config = response;

					// Manually set output text of range slider elements
					$('output', $('#visual_editor_container'))[0].innerText = response['control']['default_gamepad_speed'];
					$('output', $('#visual_editor_container'))[1].innerText = response['control']['default_keyboard_speed'];

					// Now handle loading stuff from the config file
					// Enable / disable cameras and set their ports as defined by the config
					update_cameras(response['interface']['cameras']);

					// Remove any old invalidated graphs before adding the new ones
					for(graph in graphs) {
						$("#" + graphs[graph].dom_object[0].id).remove();
					}

					// Create each sensor graph
					response['interface']['graphs'].forEach(function (graph) {
						if (graph.type == "line") {
							// Add it to the array, regardless of whether it is enabled or not
							graphs[graph.uid] = new LineGraph(graph);
							// Create the actual DOM element
							graphs[graph.uid].appendTo(graph.location);
						}
						if (graph.type == "circle") {
							// Add it to the array, regardless of whether it is enabled or not
							graphs[graph.uid] = new CircleGraph(graph);
							// Create the actual DOM element
							graphs[graph.uid].appendTo(graph.location);
						}
						if (graph.type == "text") {
							// Add it to the array, regardless of whether it is enabled or not
							graphs[graph.uid] = new TextBox(graph);
							// Create the actual DOM element
							graphs[graph.uid].appendTo(graph.location);
						}
						if (graph.type == "thermalcamera") {
							// Add it to the array, regardless of whether it is enabled or not
							graphs[graph.uid] = new ThermalCamera(graph);
							// Create the actual DOM element
							graphs[graph.uid].appendTo(graph.location);
						}
					});

					// Generate the same unique sensor IDs that SIGHTSRobot generates
					let sensorCount = {};

					response['sensors'].forEach(function (sensor) {
						if (sensor['enabled']) {
							let type = sensor['type'];
							if(type in sensorCount) {
								sensorCount[type] += 1;
							}
							else {
								sensorCount[type] = 1;
							}
							let sensorId = type + "_" + sensorCount[type];
							console.log("Sensor of type '" + sensor['type'] +"' with name '" + sensor['name'] + "' is assigned ID: " + sensorId);
							
							sensor['display_on'].forEach(function (graph) {
								if (!("handles" in graphs[graph]))
									graphs[graph]["handles"] = []
								graphs[graph]["handles"].push(sensorId)
							});
							
							// Add to dictionary of sensors
							sensors[sensorId] = sensor;
						}
					});

					sensorsReady = true;
				});

				// Other items in the initial message
				// Set running config
				running_config = obj["running_config"]
				$("#current_config").html(running_config);
				$(".editor_filename").val(running_config.slice(0,-5));

				updateConfigSelector();

				// Software versions
				if ("version_robot" in obj) {
					$("#version_robot").html(obj["version_robot"]);
				}
				if ("version_interface" in obj) {
					$("#version_interface").html(obj["version_interface"]);
				}
				if ("version_supervisorext" in obj) {
					$("#version_supervisorext").html(obj["version_supervisorext"]);
				}

				// System uptime
				if ("uptime" in obj) {
					startTime = Date.now() - (obj["uptime"] * 1000);
				}
			}

			if ("sensor_data" in obj && sensorsReady)  {
				// For each sensor data we received
				Object.entries(obj["sensor_data"]).forEach(([sensor_uid, sensor_data]) => {
					// Ensure it has the "display_on" array which defines where it should be displayed
					if ("display_on" in sensors[sensor_uid]) {
						// For each graph where it should be displayed
						sensors[sensor_uid]["display_on"].forEach(function (graph) {
							graphs[graph]["handles"].forEach(function (value, index) {
								if (value == sensor_uid)
									// Lookup the graph and update it with the new data
									graphs[graph].update(index, sensor_data, sensors[sensor_uid]["name"]);
							});
						});
					}
				});
			}

			// Permanent/default "sensors"
			// Speed indicators for keyboard and gamepad
			if ("kb_speed" in obj) {
				setSpeedIndicator("kb", obj["kb_speed"]);
			}
			if ("gp_speed" in obj) {
				setSpeedIndicator("gp", obj["gp_speed"]);
			}
		}
	}
}

$(document).on("ready",function () {
	sensorConnection();
});
