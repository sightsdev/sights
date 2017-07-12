<!DOCTYPE html>
<html>
	<title>Restarting</title>
	<head>
		<link rel="stylesheet" href="assets/style.css">
		<link rel="stylesheet" href="assets/bootstrap.css">
		<link rel="shortcut icon" href="assets/favicon.ico" type="image/x-icon" />
	</head>
	<body>
		<div class="loader">
			<img id="loadingImage" src="assets/image/loader.gif" />
			<h3>Restarting the S.A.R.T</h3>
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
	$out = exec("sudo reboot");//Sends the command to restart the NUC
		echo $out;
?>