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
	
	<title>Help - Power Options</title><!--The title displayed in the browser tab bar-->
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
						<h3>Power Options</h3>
						<p>The S.A.R.T Interface has two power options to help you manage the S.A.R.T.</p>
						<p><b>Shutdown </b>can be used to power off the system completely, saving power or allowing you to remove or swap the battery. The robot cannot be powered on remotely if this option is chosen.</p>
						<p><b>Restart </b>can be used to restart the robot. It will automatically reconnect to the S.A.R.T network if it is within range, so a restart can be useful if the robot is slow or unresponsive while inaccessible.</p>						
						<h3>Troubleshooting</h3>
						<h4><b>Both power options do nothing</b></h4>
						<p>This can be caused by permissions issues. The user www-data needs permission to run the <b>sudo poweroff</b> and <b>sudo reboot</b> commands in the visudo file.</p>
						<br>
						<h4><b>The S.A.R.T page does not reload</b></h4>
						<p>The most likely cause is that the robot is out of range. Move the control panel as close as possible to the robot and wait for it to reconnect. It will connect automatically assuming it does not connect to another network (Always remember to "forget" other networks you connect so that the S.A.R.T Network is preferred over all others.</p>													
						<br>
						<p><a href="index.php">Back to Help</a></li><p>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>