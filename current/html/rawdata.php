var rawDataSocket = new WebSocket("ws://<?php echo $_SERVER['SERVER_ADDR'] ?>:5556");
rawDataSocket.onmessage = function(event){
	$(".scroller").prepend(event.data + "<br>");
}