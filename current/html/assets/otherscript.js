var ip = window.location.hostname;

console.log(ip);

function refreshStream() {
	document.getElementById('streamImage').src += '';
}

function refreshSSH() {
	document.getElementById('sshiframe').src += '';
}

function snapshotStream() {
	$.get("http://10.0.2.3:8080/0/action/snapshot");
	
	setTimeout(function()  {
		window.open("/downloadsnapshot.php");
	}, 2000);
}

function recordStreamEvent() {
	$.get("http://10.0.2.3:8080/0/action/makemovie");
}

var streamFlipped = false;

function flipStream() {
	var streamFlipX = document.getElementById("streamImage");
	var streamFlipY = document.getElementById("flipY")
	
	if(streamFlipped == false){
		streamFlipX.style.transform = "rotatex(180deg)";
		streamFlipX.style.transitionDuration = "0.5s"
		streamFlipY.style.transform = "rotatey(180deg)";
		streamFlipY.style.transitionDuration = "0.5s"
		streamFlipped = true;
	}
	else{
		streamFlipX.style.transform = "rotatex(0deg)";
		streamFlipX.style.transitionDuration = "0.5s"
		streamFlipY.style.transform = "rotatex(0deg)";
		streamFlipY.style.transitionDuration = "0.5s"
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