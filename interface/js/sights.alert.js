/*
	Created by the Semi Autonomous Rescue Team
	Licensed under the GNU General Public License 3.0
*/

/* Websocket Alerts */
function sensorsConnectedAlert() {
    $("#sensor_status").removeClass("btn-danger").addClass("btn-success");
    bootoast.toast({
        "message": "Sensor socket connected",
        "type": "success",
        "icon": "link",
        "position": "left-bottom"
    });
}

function sensorsDisconnectedAlert() {
    $("#sensor_status").removeClass("btn-success").addClass("btn-danger");
    bootoast.toast({
        "message": "Sensor socket disconnected",
        "type": "danger",
        "icon": "unlink",
        "position": "left-bottom"
    });
}

function controlConnectedAlert() {
    $("#control_status").removeClass("btn-danger").addClass("btn-success");
    bootoast.toast({
        "message": "Control socket connected",
        "type": "success",
        "icon": "link",
        "position": "left-bottom"
    });

}

function controlDisconnectedAlert() {
    $("#control_status").removeClass("btn-success").addClass("btn-danger");
    bootoast.toast({
        "message": "Control socket disconnected",
        "type": "danger",
        "icon": "unlink",
        "position": "left-bottom"
    });
}

/* Gamepad Alerts */
function gamepadConnectedAlert() {
    // Controller status indicator
    $("#controller_status_connected").show();
    $("#controller_status_disconnected").hide();
    // Create corresponding toast
    bootoast.toast({
        "message": "Controller connected",
        "icon": "gamepad",
        "type": "success",
        "position": "left-bottom"
    });
}

function gamepadDisconnectedAlert() {
    bootoast.toast({
        "message": "Controller disconnected",
        "type": "danger",
        "icon": "gamepad",
        "position": "left-bottom"
    });
}

/* Power Alerts */
function shutdownAlert() {
    bootoast.toast({
        "message": "Shutting down",
        "type": "warning",
        "icon": "power-off",
        "position": "left-bottom"
    });
}

function rebootAlert() {
    bootoast.toast({
        "message": "Rebooting",
        "type": "warning",
        "icon": "undo",
        "position": "left-bottom"
    });
}

/* Config Alerts */
function configReceivedAlert() {
    bootoast.toast({
        "message": "Received config file",
        "type": "success",
        "icon": "file-alt",
        "position": "left-bottom"
    });
}

function configSentAlert() {
    bootoast.toast({
        "message": "Sent config file",
        "type": "success",
        "icon": "file-alt",
        "position": "left-bottom"
    });
}

function configInvalidAlert() {
    bootoast.toast({
        "message": "Invalid config file",
        "type": "danger",
        "icon": "file-alt",
        "position": "left-bottom"
    });
}

function configRequestedAlert() {
    bootoast.toast({
        "message": "Requested config file",
        "type": "info",
        "icon": "file-alt",
        "position": "left-bottom"
    });
}

/* Service Alerts */
function serviceAlert(type, message) {
    bootoast.toast({
        "message": message,
        "type": type,
        "icon": "server",
        "position": "left-bottom"
    });
}
