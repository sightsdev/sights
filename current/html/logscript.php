var clearTime = 10;

var logSocket = new WebSocket("ws://<?php echo $_SERVER['SERVER_ADDR'] ?>:5556");
logSocket.onmessage = function(event){
	$(".logScroller").prepend(event.data + "<br>");
}

setInterval(function() {
	document.getElementById(".logSscroller").innerHTML = "";
}, clearTime * 1000);