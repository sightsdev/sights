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

function update_cameras() {
	['front', 'left', 'right', 'back'].forEach(function (e) {
		// Get parent div of camera stream image
		var card = $("#camera_" + e + "_card");
		// Enable the div, if camera is enabled in config file
		loadConfigSetting(['interface', 'cameras', e, 'enabled'], false) ? card.show() : card.hide();
		// Set image attributes to the relevant URL
		let camera = $("#camera_" + e);
		let id = loadConfigSetting(['interface', 'cameras', e, 'id'], null);
		if(!id) {
			return;
		}
		camera.attr("src", "http://" + ip + ":8081/" + id + "/stream");
		camera.attr("data-id", id);
		$("#sensor_toggle").show();
	});
	if (!loadConfigSetting(['interface', 'cameras', 'back', 'enabled'], false) &&
		!loadConfigSetting(['interface', 'cameras', 'left', 'enabled'], false) &&
		!loadConfigSetting(['interface', 'cameras', 'right', 'enabled'], false)) {
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
					editorBaseConfig = JSON.stringify(configEditor.getValue());
					editorSavedConfig = editorBaseConfig;
					updateConfigAlerts();
					// Keep a copy to work from
					global_config = response;

					// Manually set output text of range slider elements
					$('output', $('#visual_editor_container'))[0].innerText = response['control']['default_gamepad_speed'];
					$('output', $('#visual_editor_container'))[1].innerText = response['control']['default_keyboard_speed'];

					// Now handle loading stuff from the config file
					// Enable / disable cameras and set their ports as defined by the config
					update_cameras();

					// Remove any old invalidated graphs before adding the new ones
					for(let graph in graphs) {
						graphs[graph].remove();
					}
					graphs = {};

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
							interfaceLog("info", "sensors", "Sensor of type '" + sensor['type'] +
								"' with name '" + sensor['name'] + "' is assigned ID: " + sensorId);
							if (Array.isArray(sensor["display_on"])) {
								sensor['display_on'].forEach(function (graph) {
									// If the graph sensor wants to display on exists
									if (graph in graphs) {
										if (!("handles" in graphs[graph]))
											graphs[graph]["handles"] = [];
										graphs[graph]["handles"].push(sensorId);
									}
									else {
										interfaceLog("warning", "sensors", sensorId + " will " +
											"not output to graph " + graph + " because " + graph + " does not exist.")
									}
								});
							}
							else {
								// Deal with multi-sensors
								Object.entries(sensor["display_on"]).forEach(([type, [graph]]) => {
									if (graph in graphs) {
										if (!("handles" in graphs[graph]))
											graphs[graph]["handles"] = [];
										graphs[graph]["handles"].push(sensorId + "_" + type);
									}
									else {
										interfaceLog("warning", "sensors", sensorId + " will " +
											"not output to graph " + graph + " because " + graph + " does not exist.")
									}
								});
							}
							
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
						if(Array.isArray(sensors[sensor_uid]["display_on"])) {
							sensors[sensor_uid]["display_on"].forEach(function (graph) {
								if(graph in graphs) {
									graphs[graph]["handles"].forEach(function (value, index) {
										if (value == sensor_uid)
											// Lookup the graph and update it with the new data
											graphs[graph].update(index, sensor_data, sensors[sensor_uid]["name"]);
									});
								}
								else {
									interfaceLog("warning", "sensors", sensor_uid + " cannot " +
										"update graph " + graph + " because " + graph + " does not exist.")
								}
							});
						}
						else {
							// Deal with multi-sensors
							Object.entries(sensors[sensor_uid]["display_on"]).forEach(([type, [graph]]) => {
								if (graph in graphs) {
									graphs[graph]["handles"].forEach(function (value, index) {
										if (value == sensor_uid + "_" + type)
											// Lookup the graph and update it with the new data
											graphs[graph].update(index, sensor_data[type], sensors[sensor_uid]["name"] +
												" " + type);
									});
								}
								else {
									interfaceLog("warning", "sensors", sensor_uid + " cannot " +
										"update graph " + graph + " because " + graph + " does not exist.")
								}
							});
						}
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
