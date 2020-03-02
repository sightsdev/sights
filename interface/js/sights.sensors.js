/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

var sensorSocket;
var sensorConnected;
var running_config;

var graphs = {};
var sensors = {};
var sensorsReady = false;

var global_config;

function updateCameras() {
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
	});
}

function updateGraphs(sensor_uid, sensor_data, initial=false) {
	if (!sensors[sensor_uid]) {
		interfaceLog("warning", "sensors", "Service sent data for " + sensor_uid + " but " +
			sensor_uid + " does not exist on the interface.");
		return;
	}

	// Ensure it has the "display_on" array which defines where it should be displayed
	if (!("display_on" in sensors[sensor_uid])) {
		interfaceLog("warning", "sensors", "Service sent data for " + sensor_uid + " but " +
			"did not specify a graph to display it on during initialisation.");
		return;
	}

	// If the sensor has one display_on field (it is not a multi-sensor)
	if(Array.isArray(sensors[sensor_uid]["display_on"])) {
		// For each graph the sensor would like to update
		sensors[sensor_uid]["display_on"].forEach(function (graph) {
			// If the graph exists
			if(graph in graphs) {
				// For every graph, check if it handles this sensor
				graphs[graph]["handles"].forEach(function (value, index) {
					if (value == sensor_uid) {
						// Lookup the graph and update it with the new data
						if (initial) {
							// If this is initialisation data, perform setup
							graphs[graph].setup(index, sensor_data, sensors[sensor_uid]["name"]);
						}
						else {
							// Else do the standard graph update.
							graphs[graph].update(index, sensor_data, sensors[sensor_uid]["name"]);
						}
					}
				});
			}
			else { // Else, the graph does not exist
				interfaceLog("warning", "sensors", sensor_uid + " cannot " +
					"update graph " + graph + " because " + graph + " does not exist.");
			}
		});
	}
	else { // Else, the sensor has multiple display_on fields (it is a multi-sensor)
		// For each graph the sensor would like to update
		Object.entries(sensors[sensor_uid]["display_on"]).forEach(([type, [graph]]) => {
			// If the graph exists
			if (graph in graphs) {
				// For every graph, check if it handles this sensor and message type
				graphs[graph]["handles"].forEach(function (value, index) {
					if (value == sensor_uid + "_" + type) {
						// Lookup the graph and update it with the new data
						if (initial) {
							// If this is initialisation data, perform setup
							graphs[graph].setup(index, sensor_data[type], sensors[sensor_uid]["name"] +
								" " + type)
						}
						else {
							// Else do the standard graph update.
							graphs[graph].update(index, sensor_data[type], sensors[sensor_uid]["name"] +
								" " + type)
						}
					}
				});
			}
			else { // Else, the graph does not exist
				interfaceLog("warning", "sensors", sensor_uid + " cannot " +
					"update graph " + graph + " because " + graph + " does not exist.");
			}
		});
	}
}

function sensorUpdate(obj) {
	// Update sensor monitor (in log modal)
	$("#sensor_monitor_pre").html(hljs.highlight("JSON", JSON.stringify(obj, null, "\t")).value);

	if("initial_message" in obj) {
		interfaceLog("info", "sensors", "Received initial message");
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
			updateCameras();

			// Remove any old invalidated graphs before adding the new ones
			for(let graph in graphs) {
				graphs[graph].remove();
			}
			graphs = {};
			differentColours = {}; // Reset graph colours
			sensors = {};
			// If a textbox group list-group doesn't contain any hardcoded list elements, hide it
			$('.textgroup-container > .col > .card > .list-group:not(:has(li))').each(function () {
				$(this).parent().parent().parent().hide();
			});

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
				if (graph.type == "uptime") {
					// Add it to the array, regardless of whether it is enabled or not
					graphs[graph.uid] = new UptimeBox(graph);
					// Create the actual DOM element
					graphs[graph.uid].appendTo(graph.location);
				}
			});

			$('#speed_textbox').show();
			// Now that cameras and graphs have been created, we should be able to determine what modes the
			// interface has and enable or disable toggling.
			toggleSensorMode(); // Enable/disable correct options for the current mode
			if (sensorModeEnabled() && cameraModeEnabled()) {
				toggleSensorMode(); // Switch back to camera mode
			}

			let sensorCount = {};

			// Add sensors to graphs
			response['sensors'].forEach(function (sensor) {
				// Generate the same unique sensor IDs that SIGHTS generates
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

					// If the sensor has one display_on field (it is not a multi-sensor)
					if (Array.isArray(sensor["display_on"])) {
						// For each graph the sensor would like to display_on
						sensor['display_on'].forEach(function (graph) {
							// If the graph exists
							if (graph in graphs) {
								// Add this sensor to the list of sensors the graph handles.
								if (!("handles" in graphs[graph]))
									graphs[graph]["handles"] = [];
								graphs[graph]["handles"].push(sensorId);
							}
							else { // Else, the graph does not exist
								interfaceLog("warning", "sensors", sensorId + " will " +
									"not output to graph " + graph + " because " + graph + " does not exist.")
							}
						});
					}
					else { // Else, the sensor has multiple display_on fields (it is a multi-sensor)
						// For each graph the sensor would like to display_on
						Object.entries(sensor["display_on"]).forEach(([type, [graph]]) => {
							// If the graph exists
							if (graph in graphs) {
								// Add this sensor to the list of sensors the graph handles.
								if (!("handles" in graphs[graph]))
									graphs[graph]["handles"] = [];
								graphs[graph]["handles"].push(sensorId + "_" + type);
							}
							else { // Else, the graph does not exist
								interfaceLog("warning", "sensors", sensorId + " will " +
									"not output to graph " + graph + " because " + graph + " does not exist.")
							}
						});
					}

					// Add to dictionary of sensors
					sensors[sensorId] = sensor;
				}
			});

			// Handle sensors that send initialisation data and pass that data to the correct graph
			if (obj["initial_sensor_data"]) {
				Object.entries(obj["initial_sensor_data"]).forEach(([sensor_uid, sensor_data]) => {
					updateGraphs(sensor_uid, sensor_data, true);
				});
			}
			// For each sensor_data we received
			if (obj["sensor_data"]) {
				Object.entries(obj["sensor_data"]).forEach(([sensor_uid, sensor_data]) => {
					updateGraphs(sensor_uid, sensor_data);
				});
			}

			sensorsReady = true;
		});

		// Other items in the initial message
		// Set running config
		running_config = obj["running_config"];
		getRevisions(running_config);  // Get the revisions of this config file and display in the revisions tab
		$("#current_config").html(running_config);
		$(".editor_filename").val(running_config.slice(0,-5));

		updateConfigSelector();

		// Software versions
		if ("version_sights" in obj) {
			$("#version_sights").html(obj["version_sights"]);
			updateCheck("sights");
		}

		// System uptime
		if ("uptime" in obj) {
			startTime = Date.now() - (obj["uptime"] * 1000);
		}
	}

	if ("sensor_data" in obj && sensorsReady)  {
		// For each sensor_data we received
		Object.entries(obj["sensor_data"]).forEach(([sensor_uid, sensor_data]) => {
			updateGraphs(sensor_uid, sensor_data);
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

function sensorConnection() {
	if (!demo) {
		// Start WebSocket receiver
		sensorSocket = new WebSocket("ws://" + ip + ":5556");
		sensorSocket.onopen = function () {
			sensorConnected = true;
			sensorsConnectedAlert();
		};
		sensorSocket.onclose = function () {
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

			sensorUpdate(obj);
		}
	}
}

$(document).on("ready",function () {
	sensorConnection();
});
