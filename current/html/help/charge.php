<!DOCTYPE html>
<html>
	<title>Help - Charge Remaining</title><!--The title displayed in the browser tab bar-->
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
						<h3>Charge Remaining</h3>
						<p>The battery charge remaining is based on the average power supply voltages reported by the four servos.</p>
						
						<h3>Troubleshooting</h3>
						<h4><b>Charge dips or spikes when the robot is moving</b></h4>
						<p>This is due to the way the voltage data is collected. The servos can report slightly different power supply voltages when they are drawing more power as opposed to when they are stationary.</p>
						<br>
						<h4><b>Charge remaining is inaccurate for my battery</b></h4>
						<p>Ensure you have selected the correct number of cells for your lithium polymer battery in Settings.</p>
						
						<br>
						<p><a href="index.php">Back to Help</a></li><p>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>