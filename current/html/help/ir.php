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
	
	<title>Help - IR Distance</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link Bootstrap-->
		<link rel="stylesheet" href="../assets/bootstrap.css">
		<link rel="stylesheet" href="../assets/style.css">
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	</head>
	<body>
		<div class="nav topnav">
			<div class="container">
				<ul>
					<li><br></li>
					<li><a href="../index.php">Home</a></li>
					<li><strong>|</strong></li>
					<li><a href="index.php">Help</a></li>
				</ul>
			</div>
		</div>
		<div class="page-content">
			<div class="container">
				<div class="row">
					<div class="col-md-4">
						<img src="../assets/image/circle-help.png" width="245px" />
					</div>
					<div class="col-md-8">
						<div class="alert alert-info">
							<strong>Future Update</strong><br>This page contains some information about features that may not be implemented in this version of the S.A.R.T Control Panel. To check for updates, visit <a href="https://github.com/SFXRescue/SARTRobot">the S.A.R.T GitHub Repository</a>.
						</div>
						<h3>Infared Distance Map</h3>
						<p>The Infared Distance Map allows the user to see the distance between the S.A.R.T and objects on all sides.</p>
						<p>The map can be viewed on the <a href="../index.php">homepage</a>.</p>						
						<h3>Troubleshooting</h3>
						<h4><b>Sensor readings are off</b></h4>
						<p>If a sensor reading is consistently off by a certain distance, the sensor may be uncalibrated.</p>
						<p>To calibrate a sensor, first identify the sensor you want to calibrate by looking at the sensor name on the map and the name written on the robot.</p>
						<p>Click the "Calibrate" button. Adjust the slider to add or subtract a certain distance from the displayed reading.</p>
						<p>Click "Apply" to save any changes. These calibrations will be saved for future runs as well.</p>						
						<br>
						<p><a href="index.php">Back to Help</a></li><p>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>