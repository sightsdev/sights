<!DOCTYPE html>
<html>
	<!--#########################################################
	# Created by the Semi Autonomous Rescue Team				#
	#															#
	# Author: Jack Williams										#
	# Contributors: Jack Williams								#
	#															#
	# Licensed under GNU General Public License 3.0				#
	##########################################################-->
	
	<title>Restarting</title>
	<head>
		<link rel="stylesheet" href="css/style.css">
		<link rel="stylesheet" href="css/bootstrap.css">
		<link rel="shortcut icon" href="css/favicon.ico" type="image/x-icon" />
	</head>
	<body>
		<!--Let the user know what is happening-->
		<div class="loader">
			<img id="loadingImage" src="images/loader.gif" />
			<h3>S.A.R.T. Robot Restarting</h3>
			<div class="retrying">
				<p>Reconnecting in <span id="countdown">-</span> seconds</p>
			</div>
		</div>

		<script language="javascript" type="text/javascript">
			var timeLeft = 40;

			var timeDec = setInterval(function (){
				document.getElementById('countdown').innerHTML = timeLeft;//Display the time left until connection attempt
				if(timeLeft === 0){//when 0 seconds left to retry
					window.location.href = "index.php";//Redirect the user back home
				}
				timeLeft--;//Subtract 1 from time left
			}, 1000);//1 second loop
		</script>
	</body>
</html>
<?php
	$out = exec("sleep 3; sudo reboot");//Sends the command to restart the S.A.R.T Robot
		echo $out;
?>