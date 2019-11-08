
function updateServiceInfo(response, status, jqXHR) {
    $("#service_info_name").html(response[0].name);
    $("#service_info_logfile").html(response[0].logfile);
    $("#service_info_status").html("");

    
    var state = response[0].statename;
    // 
    $("#service_info_buttons").show();
    // Update service state indicator
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
        params: {name: 'sights'},
        success: updateServiceInfo,
        error: function(jqXHR, status, error) { }
    });
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'supervisor.tailProcessStdoutLog',
        params: {name: 'sights', offset: '0', length: '1500'},
        success: function(response, status, jqXHR) {
            $("#service_info_pre").html(hljs.highlight("YAML", response[0][0]).value);
        },
        error: function(jqXHR, status, error) {
            $("#service_info_logfile").html("Couldn't get service information");
            $("#service_info_buttons").hide();
        }
    });
}

function updateConfigSelector() {
    $.xmlrpc({
        url: '/RPC2',
        methodName: 'sights_config.getConfigs',
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
                methodName: 'sights_config.getActiveConfig',
                params: {},
                success: function(response, status, jqXHR) {
                    // Also remove any line breaks from the string.
                    // And set it to be the active select element
                    $("#config_selector").val(response[0].replace(/(\r\n|\n|\r)/gm, "")).change();
                },
                error: function(jqXHR, status, error) {
                    serviceAlert("danger", "Couldn't get active config file");
                }
            });
        },
        error: function(jqXHR, status, error) {
            serviceAlert("danger", "Couldn't get available config files");
        }
    });
}

$(document).on("ready",function () {
    setInterval(updateService, 500);

    // Populate config file selector
    updateConfigSelector();

    $('#config_refresh_button').on("click", function() {
        updateConfigSelector();
    });

    $('#config_save_button').on("click", function() {
        $.xmlrpc({
            url: '/RPC2',
            methodName: 'sights_config.setActiveConfig',
            params: {value: $('#config_selector').val()},
            success: function(response, status, jqXHR) {
                serviceAlert("success", "Set config file, restart service to apply");
            },
            error: function(jqXHR, status, error) {
                serviceAlert("danger", "Couldn't set config file");
            }
        });
    });

    $('#service_start_button').on("click", function() {
        serviceAlert("info", "Starting service");
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.startProcess',
            params: {name: 'sights'},
            success: function(response, status, jqXHR) {
                serviceAlert("success", "Service started");
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
            },
            error: function(jqXHR, status, error) {
                serviceAlert("danger", "Couldn't stop service");
            }
        });
    });

    $('#service_info_clear_button').on("click", function() {
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


    $('#service_restart_button').on("click", function() {
        serviceAlert("info", "Restarting service");
		$.xmlrpc({
            url: '/RPC2',
            methodName: 'supervisor.stopProcess',
            params: {name: 'sights'},
            success: function(response, status, jqXHR) {
                $.xmlrpc({
                    url: '/RPC2',
                    methodName: 'supervisor.startProcess',
                    params: {name: 'sights'},
                    success: function(response, status, jqXHR) {
                        serviceAlert("success", "Service restarted");
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
});
