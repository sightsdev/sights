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
				document.getElementById("flipFeedback").innerHTML = "Flipped Controls";
				flipStream();
				flipped = true;
			}
			else {
				flipped = false;
				flipStream();
				document.getElementById("flipFeedback").innerHTML = "";
			}
			break;
		case 73: //I (Front Wheels Forward)
			document.getElementById("controlFeedback").innerHTML = "Front Wheels Forward " + speed * 10 + "%";
			if(flipped == true){
				controlSocket.send("7 " + speed);		
			}
			else {
				controlSocket.send("5 " + speed);
			}
			break;
		case 79: //O (Rear Wheels Forward)
			document.getElementById("controlFeedback").innerHTML = "Rear Wheels Forwards " + speed * 10 + "%";
			if(flipped == true){
				controlSocket.send("8 " + speed);		
			}
			else {
				controlSocket.send("6 " + speed);
			}
			break;
		case 74: //J (Front Wheels Reverse)
			document.getElementById("controlFeedback").innerHTML = "Front Wheels Reverse " + speed * 10 + "%";
			if(flipped == true){
				controlSocket.send("5 " + speed);		
			}
			else {
				controlSocket.send("7 " + speed);
			}
			break;
		case 75: //K (Rear Wheels Reverse)
			document.getElementById("controlFeedback").innerHTML = "Rear Wheels Reverse " + speed * 10 + "%";
			if(flipped == true){
				controlSocket.send("6 " + speed);		
			}
			else {
				controlSocket.send("8 " + speed);
			}
			break;
		case 66:
			document.getElementById().innerHTML = "Executing Order 66";
			controlSocket.send("9 " + speed);
			break;
	}
}

//Untested. If it doesn't work add the switch statement back.
function onKeyUp(event) {
	console.log("(Key Up) Socket Status: " + socketState());

	var key = event.keyCode;
	if(key == 87 || key == 65 || key == 83 || key == 68 || key == 70 || key == 73 || key == 79 || key == 74 || key == 75) {
		document.getElementById("controlFeedback").innerHTML = "Stationary";
		controlSocket.send("0 0");
		lastKey = 0;
	}
}