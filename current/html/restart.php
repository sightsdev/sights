<!DOCTYPE html>
<html>
	<title>Restarting</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link Bootstrap-->
		<link rel="stylesheet" href="assets/style.css">
		<link rel="stylesheet" href="assets/bootstrap.css">
		<!--Link the favicon-->
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	</head>
	<body>
		<div class="loader"><!--Create a div that can be referenced in CSS-->
				<img id="loadingImage" src="assets/image/loader.gif" /><!--Link to the preloader gif-->
				<img id="halImage" src = "assets/image/dot.png" width="100px" style="display: none;"/>
			<h3><span id="heading">Restarting the S.A.R.T</span></h3>
			<div class="retrying">
				<p>Retrying Connection in <span id="countdown">-</span> seconds</p><!--the span "countdown" can be referenced in JavaScript-->
				<p><b><span id="message">Reconnect your device to the S.A.R.T Network when it appears.</span></b></p>
				<p><span id="timerCounter"><br></span></p>
			</div>
		</div>

<!--Check if device is connected to a network before redirecting to main page-->
<script language="javascript" type="text/javascript">	
	var request = new XMLHttpRequest();
request.open("GET", "restartscript.php", true);<!--Open restart.php to restart the S.A.R.T-->
request.send(null);
var tries = 0;
var seconds = 6;

setInterval(function () {
    var timeLeft = 6,
        cinterval;

    var timeDec = function (){
        timeLeft--;<!--Subtract 1 from time left-->
        document.getElementById('countdown').innerHTML = timeLeft;<!--Display the time left until next reconnect attempt-->
        if(timeLeft === 0){<!--when 0 seconds left to retry-->
			tries++;
            clearInterval(cinterval);
			if (navigator.onLine == false) {<!--Check if user is not connected-->
				<!--Add a message telling the user not to worry-->
				if (tries === 10){//10
					document.getElementById('message').innerHTML = "Don't worry, restarting can often take a minute or two.";
				}
				if (tries === 20){//20
					document.getElementById('message').innerHTML = "The S.A.R.T should be online. Reconnect to the S.A.R.T network.";
				}
				if (tries === 25){
					document.getElementById('message').innerHTML = "Something may be wrong... Are you sure you reconnected to the S.A.R.T network?";
				}
				if (tries === 30){
					document.getElementById('message').innerHTML = "Something is wrong.";
				}
				if (tries === 35){
					document.getElementById('message').innerHTML = "Total System Failure";
				}
				if (tries === 37){//37
					document.getElementById('heading').innerHTML = "I'm sorry, Dave. I'm afraid I can't do that.";
					document.getElementById('message').style.display = "none";
					document.getElementById('timerCounter').style.display = "none";
					document.getElementById("loadingImage").style.display = "none";
					document.getElementById("halImage").style.display = "inline";
				}
			}
			else {<!--If the user is connected-->
				window.location.href = "index.php";<!--Redirect the user back home-->
			}
        }
		
		
		var timerString = "";//Create an empty string
		var secs = parseInt(seconds % 60);
		var mins = parseInt(seconds / 60 % 60);
		var hours = parseInt(seconds / 3600 % 24);
		var days = parseInt(seconds / 86400);
		if (days > 0) {
			timerString += days;
			timerString += ((days == 1) ? " day" : " days");
		}
		if (hours > 0) {
			timerString += ((days > 0) ? ", " : "") + hours;
			timerString += ((hours == 1) ? " hour" : " hours");
		}
		if (mins > 0) {
			timerString += ((days > 0 || hours > 0) ? ", " : "") + mins;
			timerString += ((mins == 1) ? " minute" : " minutes");
		}
		if (secs > 0) {
			timerString += ((days > 0 || hours > 0 || mins > 0) ? ", " : "") + secs;
			timerString += ((secs == 1) ? " second" : " seconds");
		}
	document.getElementById('timerCounter').innerHTML = "Restarting for " + timerString;
	seconds++;//Add 1 second to the uptime
    };

    cinterval = setInterval(timeDec, 1000);
}, 6000);<!--6 second loop (includes 5 to 0)-->
</script>
	</body>
</html>