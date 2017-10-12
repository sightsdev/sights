var ip = window.location.hostname;

var sensorSocket = new WebSocket("ws://" + ip + ":5557");
var servoSocket = new WebSocket("ws://" + ip + ":5556");

sensorSocket.onmessage = function(event){

var sensorStr = event.data;
//Need to check the order of the sensors
var sensorArray = sensorStr.split(' '),
    sonarLeft = performanceArray[0], sonarFront = performanceArray[1], sonarRight = performanceArray[2], sonarRear = performanceArray[3];

//document.getElementById("sonar front element whatever it is")
}

servoSocket.onmessage = function(event){

var servoStr = event.data;

var servoArray = servoStr.split(' '),
    servoFrontLeft = servoArray[0], servoFrontRight = servoArray[1], servoRearRight = servoArray[2], servoRearLeft = servoArray[3];
	
//document.getElementById("servo front left element whatever it is")
}
