var ip = window.location.hostname;

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

console.log("Attempting to connect to the websosocket server");
var controlSocket = new WebSocket("ws://" + ip + ":5555");

function socketState() {
	var state = controlSocket.readyState
	switch (state) {
		case 0:
			return "Connecting (The connection is not yet open)";
		case 1:
			return "Open (The connection is open and ready to communicate)";
		case 2:
			return "Closing (The connection is in the process of closing)";
		case 3:
			return "Closed (The connection is closed or couldn't be opened)";
	}
}

console.log("Attempt result: " + socketState());

var speed = 10;
var lastKey = 0;
var flipped = false;

function onKeyDown(event) {
	console.log("(Key Down) Socket Status: " + socketState());
	var key = event.keyCode;
	
	if (lastKey == key) {
		return;
	}
	lastKey = key;
	
	switch (key) {
		case 49: //1
			speed = 1;
			break;
		case 50: //2
			speed = 2;
			break;
		case 51: //3
			speed = 3;
			break;
		case 52: //4
			speed = 4;
			break;
		case 53: //5
			speed = 5;
			break;
		case 54: //6
			speed = 6;
			break;
		case 55: //7
			speed = 7;
			break;
		case 56: //8
			speed = 8;
			break;
		case 57: //9
			speed = 9;
			break;
		case 48: //0
			speed = 10;
			break;
		case 87: //W (Forwards)
			document.getElementById("controlFeedback").innerHTML = "Forward " + speed * 10 + "%";
			if(flipped == true){
				controlSocket.send("2 " + speed);		
			}
			else {
				controlSocket.send("1 " + speed);
			}
			break;
		case 65: //A (Left)
			document.getElementById("controlFeedback").innerHTML = "Spin Left " + speed * 10 + "%";
			controlSocket.send("3 " + speed);
			break;
		case 83: //S (Reverse)
			document.getElementById("controlFeedback").innerHTML = "Reverse " + speed * 10 + "%";
			if(flipped == true){
				controlSocket.send("1 " + speed);		
			}
			else {
				controlSocket.send("2 " + speed);
			}
			break;
		case 68: //D (Right)
			document.getElementById("controlFeedback").innerHTML = "Spin Right " + speed * 10 + "%";
			controlSocket.send("4 " + speed);
			break;
		case 70: //F (Flip Controls)
			if(flipped == false){
				document.getElementById("flipFeedback").innerHTML = "Flipped Controls"
				flipped = true;
			}
			else {
				flipped = false;
				document.getElementById("flipFeedback").innerHTML = ""
			}
			break;		
	}
}

//Untested. If it doesn't work add the switch statement back.
function onKeyUp(event) {
	console.log("(Key Up) Socket Status: " + socketState());

	var key = event.keyCode;
	if(key == 87 || key == 65 || key == 83 || key == 68 || key == 70) {
		document.getElementById("controlFeedback").innerHTML = "Stationary";
		controlSocket.send("0 0");
		lastKey = 0;
	}
}