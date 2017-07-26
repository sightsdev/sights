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

var flipped = false;

function flipStream() {
	var flip = document.getElementById("streamImage");
	
	if(flipped == false){
		flip.style.transform = "rotatex(180deg)";
		flip.style.transitionDuration = "0.5s"
		flipped = true;
	}
	else{
		flip.style.transform = "rotatex(0deg)";
		flip.style.transitionDuration = "0.5s"
		flipped = false;
	}
}

function flipTrackingStream() {
	var flip = document.getElementById("trackingStreamImage");
	
	if(flipped == false){
		flip.style.transform = "rotatex(180deg)";
		flip.style.transitionDuration = "0.5s"
		flipped = true;
	}
	else{
		flip.style.transform = "rotatex(0deg)";
		flip.style.transitionDuration = "0.5s"
		flipped = false;
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