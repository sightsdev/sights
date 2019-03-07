<!DOCTYPE html>
<html>
	<!--#########################################################
	# Created by the Semi Autonomous Rescue Team				#
	#															#
	# Author: Jack Williams										#
	# Contributors: Jack Williams, Connor Kneebone				#
	#															#
	# Licensed under GNU General Public License 3.0				#
	##########################################################-->
	
	<title>Shutting Down</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link Bootstrap-->
		<link rel="stylesheet" href="css/style.css">
		<link rel="stylesheet" href="css/bootstrap.css">
		<!--Link the favicon-->
		<link rel="shortcut icon" href="css/favicon.ico" type="image/x-icon" />
	</head>
	<body>
		<div class="loader"><!--Let the user know what is happening-->
			<img src="images/loader.gif" /><!--Link to the preloader gif-->
			<h3>S.A.R.T. Robot Shutting Down</h3>
			<br>
			<p>You may close this page at any time</p>
		</div>
	</body>
</html>
<?php
	$out = exec("sleep 3; sudo poweroff"); //Sends the command to stop the S.A.R.T robot
		echo $out;
?>