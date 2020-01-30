// The setInterval that calls updateService
var serviceUpdater;
var active_config;

function updateServiceInfo(response, status, jqXHR) {
    // Only runs on first call after connecting
    if ($("#service_info_status").attr("data-state") == "DISCONNECTED") {
         // Populate config file selector
        updateConfigSelector();
    }
    
    // Get state of the SIGHTS service (RUNNING, STOPPED, etc)
    var state = response[0].statename;
    // Update service state indicator
    $("#service_info_status").attr("data-original-title", "Service " + state.toLowerCase());
    // Clear button style
    $("#service_info_status").removeClass("btn-success btn-danger btn-warning btn-secondary");
    $("#service_info_status").attr("data-state", state);
    
    // Set button style conditionally
    switch (state) {
        case "RUNNING":
            $("#service_info_status").addClass("btn-success");
            break;
        case "STARTING":
        case "STOPPING":
        case "BACKOFF":
            $("#service_info_status").addClass("btn-warning");
            break;
        case "EXITED":
        case "STOPPED":
        case "FATAL":
        default:
            $("#service_info_status").addClass("btn-danger");
            break;
    }

    // Update log filename
    $("#service_info_logfile").html(response[0].logfile);
    // Update log
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'supervisor.tailProcessStdoutLog',
        params: {name: 'sights', offset: '0', length: '10000'},
        success: function(response, status, jqXHR) {
            $("#service_info_pre").html(hljs.highlight("YAML", response[0][0]).value);
        },
        error: function(jqXHR, status, error) {
            $("#service_info_logfile").html("Couldn't get service information");
        }
    });
}

function serviceDisconnected(jqXHR, status, error) {
    // Update service state indicator
    $("#service_info_status").attr("data-state", "DISCONNECTED");
    $("#service_info_status").attr("data-original-title", "Service disconnected");
    $("#service_info_status").removeClass("btn-success btn-danger btn-warning");
    $("#service_info_status").addClass("btn-secondary");
    // Update log modal information
    $("#service_info_logfile").html("Couldn't get service information");
    // Empty config selector
    //$('#config_selector').html("");
}

function updateService() {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'supervisor.getProcessInfo',
        params: {name: 'sights'},
        success: updateServiceInfo,
        error: serviceDisconnected,
        statusCode: {
            404: function (response) {
                console.log("404: Supervisor is not available. Retrying.");
            },
            503: function (response) {
                console.log("503: Supervisor is not available. Retrying.");
            }
        }
    });
}

function updateConfigSelector() {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'system.multicall',
        params: { 
            'calls': [
                { 'methodName': 'sights_config.getConfigs', 'params': [] },
                { 'methodName': 'sights_config.getActiveConfig', 'params': [] }
            ]
        },
        success: function(response, status, jqXHR) {
            configs = response[0][0];
            // Remove any line breaks from the "active config" string.
            active_config = response[0][1].replace(/(\r\n|\n|\r)/gm, "");
            // Get the active config and make it the currently selected config
            $("#config_active_indicator").html(active_config)

            if (active_config != running_config) {
                $("#config_status").removeClass("btn-success btn-danger btn-warning btn-secondary");
                $("#config_status").addClass("btn-warning");
                $("#config_status").attr("data-original-title", "Restart service to load this config file");
            } else {
                $("#config_status").removeClass("btn-success btn-danger btn-warning btn-secondary");
                $("#config_status").addClass("btn-success");
                $("#config_status").attr("data-original-title", "This is the active config file");
            }

            $('#config_selector').html("");
            // Populate config selector
            for (var i = 0; i < configs.length; i++) {
                // Create item
                var option = $('<div class="btn-group float-right">');
                // Fill the entire line so other configs cannot be displayed alongside this one
                $(option).css('padding-left', '100%');
                // Add a data attribute with the config file name so we can find it later
                $(option).attr("data-file", configs[i]);
                // Create button with file name that will select that config file
                var enable_button = $('<a href="#" class="dropdown-item text-monospace config-item-button">');
                var delete_button = $('<a href="#" class="dropdown-item config-delete-button"><i class="fa fa-fw fa-trash-alt"></i></a>');
                // Add filename to button
                $(enable_button).html(configs[i]);
                $(delete_button).attr("data-file", configs[i]);

                $(enable_button).on("click", function() {
                    $.xmlrpc({
                        url: '/RPC2',
                        methodName: 'sights_config.setActiveConfig',
                        params: {value: $(this).html()},
                        success: function(response, status, jqXHR) {
                            serviceAlert("success", "Set config file, restart service to apply");
                            updateConfigSelector();
                        },
                        error: function(jqXHR, status, error) {
                            serviceAlert("danger", "Couldn't set config file");
                        }
                    });
                });
                $(delete_button).on("click", function() {
                    var conf = $(this).attr("data-file");
                    if (running_config == conf) {
                        serviceAlert("danger", "You cannot delete the current running config")
                    }
                    else if (active_config == conf) {
                        serviceAlert("danger", "You cannot delete the next enabled config")
                    }
                    else {
                        $.xmlrpc({
                            url: '/RPC2',
                            methodName: 'sights_config.deleteConfig',
                            params: {value: conf},
                            success: function(response, status, jqXHR) {
                                serviceAlert("success", "Deleted config");
                                updateConfigSelector();
                            },
                            error: function(jqXHR, status, error) {
                                serviceAlert("danger", "Couldn't delete config file");
                            }
                        });
                    }
                });

                if (configs[i] == active_config) {
                    // Set active item to a disabled state
                    $(enable_button).addClass("disabled");
                    $(delete_button).addClass("disabled");
                }

                // Add text and delete button to the item
                $(option).append(enable_button);
                $(option).append(delete_button);

                // Add it to the config selector
                $('#config_selector').append(option)
            }
        },
        error: function(jqXHR, status, error) {
            serviceAlert("danger", "Couldn't get available config files");
        }
    });
    
}

function requestConfig(callback) {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'sights_config.requestConfig',
        params: {},
        success: function(response, status, jqXHR) {
            callback(JSON.parse(response));
        },
        error: function(jqXHR, status, error) {
            serviceAlert("danger", "Couldn't get active config file");
        }
    });
}

function saveConfig() {
    let contents = $("#advanced_editor_pre")[0].innerText;
    let tempEditorSavedConfig = editorSavedConfig;
    let fileName = $(".editor_filename").val() + ".json";
    try {
        // Parse from YAML into JS
        let yml = jsyaml.safeLoad(contents);
        // And then turn that into a JSON string
        let val = JSON.stringify(yml, null, '\t');
        // Update visual editor
        configEditor.setValue(JSON.parse(val, indent = 4));
        $.xmlrpc({
            url: '/RPC2',
            methodName: 'sights_config.saveConfig',
            params: {value: val, name: fileName},
            success: function(response, status, jqXHR) {
                serviceAlert("success", "Saved config file");
                updateConfigSelector();
            },
            error: function(jqXHR, status, error) {
                serviceAlert("danger", "Couldn't save config file");
            }
        });
        configSentAlert();
        editorSavedConfig = JSON.stringify(configEditor.getValue());
    } catch (e) {
        configInvalidAlert();
        editorSavedConfig = tempEditorSavedConfig;
    }
    updateConfigAlerts();
}

$(document).on("ready",function () {
    // Handle shutdown and reboot buttons
    $("#shutdown_button").on("click", function () {
        if(demo) {
            location.reload();
        }
        else {
            $.xmlrpc({
                url: '/RPC2',
                methodName: 'sights_config.poweroff',
                params: {},
                success: function (response, status, jqXHR) {
                    shutdownAlert();
                },
                error: function (jqXHR, status, error) {
                    serviceAlert("danger", "Couldn't shut down");
                }
            });
        }
    });
    $("#reboot_button").on("click", function () {
        if(demo) {
            location.reload();
        }
        else {
            $.xmlrpc({
                url: '/RPC2',
                methodName: 'sights_config.reboot',
                params: {},
                success: function (response, status, jqXHR) {
                    rebootAlert();
                },
                error: function (jqXHR, status, error) {
                    serviceAlert("danger", "Couldn't reboot");
                }
            });
        }
    });

    serviceUpdater = setInterval(updateService, 500);

    $('#service_start_button').on("click", function() {
        serviceAlert("info", "Starting service");
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.startProcess',
            params: {name: 'sights'},
            success: function(response, status, jqXHR) {
                serviceAlert("success", "Service started");
                updateConfigSelector();
            },
            error: function(jqXHR, status, error) {
                serviceAlert("danger", "Couldn't start service");
            }
        });
    });
    $('#service_stop_button').on("click", function() {
        serviceAlert("info", "Stopping service");
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.stopProcess',
            params: {name: 'sights'},
            success: function(response, status, jqXHR) {
                serviceAlert("danger", "Service stopped");
                controlSocket.close();
                sensorSocket.close();
            },
            error: function(jqXHR, status, error) {
                serviceAlert("danger", "Couldn't stop service");
            }
        });
    });
    $('#service_restart_button').on("click", function() {
        serviceAlert("info", "Restarting service");
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.stopProcess',
            params: {name: 'sights'},
            success: function(response, status, jqXHR) {
                controlSocket.close();
                sensorSocket.close();
                $.xmlrpc({
                    url: '/RPC2',
                    methodName: 'supervisor.startProcess',
                    params: {name: 'sights'},
                    success: function(response, status, jqXHR) {
                        serviceAlert("success", "Service restarted");
                        updateConfigSelector();
                    },
                    error: function(jqXHR, status, error) {
                        serviceAlert("danger", "Couldn't start service");
                    }
                });
            },
            error: function(jqXHR, status, error) {
                serviceAlert("danger", "Couldn't stop service");
            }
        });
    });
    
    $('#service_log_clear_button').on("click", function() {
        $.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.clearProcessLog',
            params: {name: 'sights'},
            success: function(response, status, jqXHR) {
                serviceAlert("info", "Cleared service logs");
            },
            error: function(jqXHR, status, error) {
                serviceAlert("info", "Couldn't clear service logs");
            }
        });
    });
});
