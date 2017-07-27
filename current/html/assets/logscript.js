var ip = window.location.hostname;

var clearMinutes = 10;

var logSocket = new WebSocket("ws://" + ip + ":5559");
logSocket.onmessage = function(event){
	$(".logScroller").prepend(event.data + "<br>");
}

setInterval(function() {
	document.getElementById(".logSscroller").innerHTML = "";
}, clearMinutes * 60000);