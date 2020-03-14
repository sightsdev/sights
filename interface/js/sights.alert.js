/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

function launchToast(message, type, icon) {
    let enabled = loadConfigSetting(['interface', 'notifications', 'enabled'], true);
    let timeout = loadConfigSetting(['interface', 'notifications', 'timeout'], 7);
    if(enabled) {
        bootoast.toast({
            "message": message,
            "type": type,
            "icon": icon,
            "position": "left-bottom",
            "timeout": timeout
        });
    }
    interfaceLog("info", "toast", type + " notification: " + message);
}
/* Websocket Alerts */
function sensorsConnectedAlert() {
    $("#sensor_status").removeClass("btn-danger").addClass("btn-success");
    launchToast("Sensor socket connected", "success", "link");
}

function sensorsDisconnectedAlert() {
    $("#sensor_status").removeClass("btn-success").addClass("btn-danger");
    launchToast("Sensor socket disconnected", "danger", "unlink");
}

function controlConnectedAlert() {
    $("#control_status").removeClass("btn-danger").addClass("btn-success");
    launchToast("Control socket connected", "success", "link");
}

function controlDisconnectedAlert() {
    $("#control_status").removeClass("btn-success").addClass("btn-danger");
    launchToast("Control socket disconnected", "danger", "unlink");
}

/* Gamepad Alerts */
function gamepadConnectedAlert() {
    // Controller status indicator
    $("#controller_status_connected").show();
    $("#controller_status_disconnected").hide();
    // Create corresponding toast
    launchToast("Controller connected", "success", "gamepad");
}

function gamepadDisconnectedAlert() {
    launchToast("Controller disconnected", "danger", "gamepad");
}

/* Power Alerts */
function shutdownAlert() {
    launchToast("Shutting down", "warning", "power-off");
}

function rebootAlert() {
    launchToast("Rebooting", "warning", "undo");
}

/* Config Alerts */
function configReceivedAlert() {
    launchToast("Received config file", "success", "file-alt");
}

function configSentAlert() {
    launchToast("Sent config file", "success", "file-alt");
}

function configInvalidAlert() {
    launchToast("Invalid config file", "danger", "file-alt");
}

function configRequestedAlert() {
    launchToast("Requested config file", "info", "file-alt");
}

/* Service Alerts */
function serviceAlert(type, message) {
    launchToast(message, type, "server");
}

/* Sensor Alerts */
function duplicateGraphAlert(id) {
    launchToast("Multiple graphs with duplicate UID: " + id, "warning", "chart-line");
}
