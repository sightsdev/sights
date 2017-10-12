/*###########################################################
# Created by the Semi Autonomous Rescue Team				#
#															#
# Author: Jack Williams										#
# Contributors: Jack Williams								#
#															#
# Licensed under GNU General Public License 3.0				#
###########################################################*/

var ip = window.location.hostname; //Get the current IP (Means you don't need a DHCP server to assign addresses)

var clearMinutes = 10; //Set how frequently the log is cleared. Loading large logs may slow down the entire main page.

var logSocket = new WebSocket("ws://" + ip + ":5559");

//Prepend log messages as they are received.
logSocket.onmessage = function(event){
	$(".logScroller").prepend(event.data + "<br>");
}

//Clear the log every clearminutes minutes.
setInterval(function() {
	document.getElementById(".logSscroller").innerHTML = "";
}, clearMinutes * 60000);