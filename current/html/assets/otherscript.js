function refreshStream() {
	document.getElementById('streamImage').src = "http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8081/?time="+new Date().getTime();
}

function refreshSSH() {
	document.getElementById('sshiframe').src += '';
}

function snapshotStream() {
	$.get("http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8080/0/action/snapshot");
	
	setTimeout(function()  {
		window.open("http://<?php echo $_SERVER['SERVER_ADDR'] ?>/downloadsnapshot.php");
	}, 2000);
}

function recordStreamEvent() {
	$.get("http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8080/0/action/makemovie");
}

var streamFlipped = false;

function flipStream() {
	var streamFlip = document.getElementById("streamImage");
	
	if(streamFlipped == false){
		streamFlip.style.transform = "rotatex(180deg)";
		streamFlip.style.transitionDuration = "0.5s"
		streamFlipped = true;
	}
	else{
		streamFlip.style.transform = "rotatex(0deg)";
		streamFlip.style.transitionDuration = "0.5s"
		streamFlipped = false;
	}
}

var trackingFlipped = false;

function flipTrackingStream() {
	var trackingFlip = document.getElementById("trackingStreamImage");
	
	if(trackingFlipped == false){
		trackingFlip.style.transform = "rotatex(180deg)";
		trackingFlip.style.transitionDuration = "0.5s"
		trackingFlipped = true;
	}
	else{
		trackingFlip.style.transform = "rotatex(0deg)";
		trackingFlip.style.transitionDuration = "0.5s"
		trackingFlipped = false;
	}
}

DragDrop.bind(sshModal, {
    anchor: sshDrag
});

DragDrop.bind(irModal, {
    anchor: irDrag
});

DragDrop.bind(streamModal, {
    anchor: streamDrag
});

DragDrop.bind(rawdataModal, {
    anchor: rawdataDrag
});

DragDrop.bind(logModal, {
    anchor: logDrag
});

DragDrop.bind(trackingStreamModal, {
    anchor: trackingStreamDrag
});

$('.top').click(function() {
   $(this).siblings('.top').css('z-index', 10);
   $(this).css('z-index', 11);
});