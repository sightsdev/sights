
function updateServiceInfo(response, status, jqXHR) {
    $("#service_info_name").html(response[0].name);
    $("#service_info_logfile").html(response[0].logfile);
    $("#service_info_status").html("");

    
    var state = response[0].statename;
    // 
    $("#service_info_buttons").show();
    // Update process state indicator
    $("#service_info_statename").html(state);
    // Clear button style
    $("#service_info_statename").removeClass("btn-success btn-danger btn-warning");
    switch (state) {
        case "RUNNING":
            $("#service_info_statename").addClass("btn-success");
            break;
        case "STARTING":
        case "STOPPING":
        case "BACKOFF":
            $("#service_info_statename").addClass("btn-warning");
            break;
        case "EXITED":
        case "STOPPED":
        case "FATAL":
        default:
            $("#service_info_statename").addClass("btn-danger");
            break;
    }
}

function updateService() {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'supervisor.getProcessInfo',
        params: {name: 'sart'},
        success: updateServiceInfo,
        error: function(jqXHR, status, error) { }
    });
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'supervisor.tailProcessStdoutLog',
        params: {name: 'sart', offset: '0', length: '1500'},
        success: function(response, status, jqXHR) {
            $("#service_info_pre").html(hljs.highlight("YAML", response[0][0]).value);
        },
        error: function(jqXHR, status, error) {
            $("#service_info_logfile").html("Could not get service information");
            $("#service_info_buttons").hide();
        }
    });
}

function updateConfigSelector() {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'sart_config.getConfigs',
        params: {},
        success: function(response, status, jqXHR) {
            $('#config_selector').html("");
            // Populate config selector
            var option = '';
            for (var i = 0; i < response[0].length; i++){
                option += '<option value="'+ response[0][i] + '">' + response[0][i] + '</option>';
            }
            // Add to config selector
            $('#config_selector').append(option);
            // Get the active config and make it the currently selected config
            $.xmlrpc({
                url: '/RPC2',
                methodName: 'sart_config.getActiveConfig',
                params: {},
                success: function(response, status, jqXHR) {
                    // Also remove any line breaks from the string.
                    // And set it to be the active select element
                    $("#config_selector").val(response[0].replace(/(\r\n|\n|\r)/gm, "")).change();
                },
                error: function(jqXHR, status, error) {
                    bootoast.toast({
                        "message": "Couldn't get active config file",
                        "type": "danger",
                        "icon": "server",
                        "position": "left-bottom"
                    });
                }
            });
        },
        error: function(jqXHR, status, error) {
            bootoast.toast({
                "message": "Couldn't get available config files",
                "type": "danger",
                "icon": "server",
                "position": "left-bottom"
            });
        }
    });
}

$(document).ready(function () {
    setInterval(updateService, 500);

    // Populate config file selector
    updateConfigSelector();

    $('#config_refresh_button').click(function() {
        updateConfigSelector();
    });

    $('#config_save_button').click(function() {
        $.xmlrpc({
            url: '/RPC2',
            methodName: 'sart_config.setActiveConfig',
            params: {value: $('#config_selector').val()},
            success: function(response, status, jqXHR) {
                bootoast.toast({
                    "message": "Set new active config file",
                    "type": "success",
                    "icon": "server",
                    "position": "left-bottom"
                });
            },
            error: function(jqXHR, status, error) {
                bootoast.toast({
                    "message": "Couldn't set config file",
                    "type": "danger",
                    "icon": "server",
                    "position": "left-bottom"
                });
            }
        });
    });

    $('#process_start_button').click(function() {
        bootoast.toast({
            "message": "Starting process",
            "type": "info",
            "icon": "server",
            "position": "left-bottom"
        });
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.startProcess',
            params: {name: 'sart'},
            success: function(response, status, jqXHR) {
                bootoast.toast({
					"message": "Process started",
					"type": "success",
					"icon": "server",
					"position": "left-bottom"
				});
            },
            error: function(jqXHR, status, error) {
                bootoast.toast({
                    "message": "Couldn't start process",
                    "type": "danger",
                    "icon": "server",
                    "position": "left-bottom"
                });
            }
        });
    });
    $('#process_stop_button').click(function() {
        bootoast.toast({
            "message": "Stopping process",
            "type": "info",
            "icon": "server",
            "position": "left-bottom"
        });
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.stopProcess',
            params: {name: 'sart'},
            success: function(response, status, jqXHR) {
                bootoast.toast({
					"message": "Process stopped",
					"type": "danger",
					"icon": "server",
					"position": "left-bottom"
				});
            },
            error: function(jqXHR, status, error) {
                bootoast.toast({
                    "message": "Couldn't stop process",
                    "type": "danger",
                    "icon": "server",
                    "position": "left-bottom"
                });
            }
        });
    });
    $('#process_restart_button').click(function() {
        bootoast.toast({
            "message": "Restarting process",
            "type": "info",
            "icon": "server",
            "position": "left-bottom"
        });
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.stopProcess',
            params: {name: 'sart'},
            success: function(response, status, jqXHR) {
                $.xmlrpc({
                    url: '/RPC2',
                    methodName: 'supervisor.startProcess',
                    params: {name: 'sart'},
                    success: function(response, status, jqXHR) {
                        bootoast.toast({
                            "message": "Process restarted",
                            "type": "success",
                            "icon": "server",
                            "position": "left-bottom"
                        });
                    },
                    error: function(jqXHR, status, error) { 
                        bootoast.toast({
                            "message": "Couldn't start process",
                            "type": "danger",
                            "icon": "server",
                            "position": "left-bottom"
                        });
                    }
                });
            },
            error: function(jqXHR, status, error) {
                bootoast.toast({
                    "message": "Couldn't stop process",
                    "type": "danger",
                    "icon": "server",
                    "position": "left-bottom"
                });
            }
        });
	});
});
