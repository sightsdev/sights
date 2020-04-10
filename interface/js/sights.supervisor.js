// The setInterval that calls updateService
var serviceUpdater;
var active_config; // The selected config file (not necessarily running)

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

    // Don't show 'Demo Mode' button and the separator near it when supervisor is available
    $("#power_options_divider").hide();
    $("#demo_mode_button").hide();
    
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
    // Show 'Demo Mode' button and the separator near it
    $("#power_options_divider").show();
    $("#demo_mode_button").show();
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
                interfaceLog("warning", "supervisor", "404: Supervisor is not available. " +
                    "Retrying.");
            },
            503: function (response) {
                interfaceLog("warning", "supervisor", "503: Supervisor is not available. " +
                    "Retrying.");
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
            $("#config_active_indicator").html(active_config);

            getRevisions(active_config);  // Get the revisions of this config file and display in the revisions tab
            $(".editor_filename").val(active_config.slice(0,-5));

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

                if (configs[i] == running_config) {
                    // Set active item to a disabled state
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
    requestConfig(function(response) {
        applyConfig(response);
    });
}

function requestConfig(callback) {
    if (demo) {
        callback(demo_config);
    }
    else {
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

function getRevisions(runningConfig) {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'sights_config.getRevisions',
        params: {name: runningConfig},
        success: function(response, status, jqXHR) {
            $('#revision_selector').html("");
            $('#revision_viewer_pre').html("");
            $('#revision_selector').append("<option value='none'>Select a revision...</option>");
            response[0].forEach(function (revision) {
                var date = new Date(revision[1] * 1000);
                let option = revision[0].split(".backup.")[0] + " on " + date.toLocaleDateString() + " at " + date.toLocaleTimeString();
                $('#revision_selector').append("<option value=" + revision[0] + ">" + option + "</option>")
            });
            if ($('#revision_selector').children().length > 1) {
                $('#revision_selector').removeAttr("disabled");
            }
            else {
                $('#revision_selector').attr("disabled", "disabled");
                $("#revision_restore_button").addClass("disabled");
                $("#revision_delete_button").addClass("disabled");
                $('#revision_selector').html("");
                $('#revision_selector').append("<option value='none'>No revisions available</option>")
            }
        },
        error: function(jqXHR, status, error) {
            serviceAlert("danger", "Couldn't get past revisions of the active config");
        }
    });
}

function requestRevision(revision) {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'sights_config.requestRevision',
        params: {name: revision},
        success: function(response, status, jqXHR) {
            let yaml = jsyaml.safeDump(JSON.parse(response[0]), indent = 4);
            // Populate revision viewer
            $("#revision_viewer_pre").html(hljs.highlight("YAML", yaml).value);
        },
        error: function(jqXHR, status, error) {
            $("#revision_viewer_pre").html("");
            serviceAlert("danger", "Couldn't get revision");
        }
    });
}

function deleteRevision(revision) {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'sights_config.deleteRevision',
        params: {name: revision},
        success: function(response, status, jqXHR) {
            $('#revision_selector').children().each(function () {
                if ($(this).attr("value") == revision) {
                    $(this).remove();
                }
            });
            $('#revision_selector').val("none");
            $("#revision_viewer_pre").html("");
            $("#revision_restore_button").addClass("disabled");
            $("#revision_delete_button").addClass("disabled");
            if ($('#revision_selector').children().length == 1) {
                $('#revision_selector').attr("disabled", "disabled");
                $('#revision_selector').html("");
                $('#revision_selector').append("<option value='none'>No revisions available</option>")
            }
        },
        error: function(jqXHR, status, error) {
            serviceAlert("danger", "Couldn't delete revision");
        }
    });
}

$(document).on("ready",function () {
    // Handle shutdown and reboot buttons
    $("#shutdown_button").on("click", function () {
        if(demo) {
            location.reload();
        }
        else {
            shutdownAlert();
            $.xmlrpc({
                url: '/RPC2',
                methodName: 'sights_config.poweroff',
                params: {},
                success: function (response, status, jqXHR) {
                    serviceAlert("danger", "Couldn't shut down");
                },
                error: function (jqXHR, status, error) {
                    serviceAlert("success", "Successfully shut down");
                }
            });
        }
    });
    $("#reboot_button").on("click", function () {
        if(demo) {
            location.reload();
        }
        else {
            rebootAlert();
            $.xmlrpc({
                url: '/RPC2',
                methodName: 'sights_config.reboot',
                params: {},
                success: function (response, status, jqXHR) {
                    serviceAlert("danger", "Couldn't reboot");
                },
                error: function (jqXHR, status, error) {
                    serviceAlert("success", "Rebooting...");
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

    $('.update-button').on("click", function() {
        if ($("#service_info_status").attr("data-state") == "STOPPED") {
            serviceAlert("info", "Performing an update...");
            $.xmlrpc({
                url: '/RPC2',
                methodName: 'sights_config.update',
                params: {'dev' : this.id == "update_button_dev"},
                success: function(response, status, jqXHR) {
                    serviceAlert("success", "Updated successfully!");
                    if (response != true) {
                        serviceAlert("warning", "A system restart is required for some changes to take effect.");
                    }
                },
                error: function(jqXHR, status, error) {
                    serviceAlert("danger", "Update failed. Check <code>/var/log/sights.update.log</code>");
                }
            });
        } else {
            serviceAlert("danger", "Service must be stopped first");
        }
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
