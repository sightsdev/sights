<!DOCTYPE html>
<html>
	<title>Help - Raw Data Log</title><!--The title displayed in the browser tab bar-->
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
						<h3>Raw Data Log</h3>
						<p>The Raw Data Log is used to log much of the data sent from the robot, including servo temperatures, running commands and warnings.</p>
						<p>The log can be viewed on the <a href="../index.php">homepage</a>.</p>						
						<h3>Troubleshooting</h3>
						<h4><b>Scroll bar is slow to move</b></h4>
						<p>Some lag can occur when there is too much data in the Raw Data modal for the browser to render.</p>
						<p>To fix this, set a faster timeout for automatic data clearing in Settings.</p>
						<p>The "Clear" button can be used to quickly clear the modal if things get out of hand and you can't wait for the next automatic clear.</p>
						<p>Refreshing the webpage will also clear the Raw Data modal.</p>
						<br>
						<h4><b>Data is moving too fast to read</b></h4>
						<p>Clicking the "Stop" button will prevent the modal from receiving any more data.</p>
						<p>Clicking the same button (Now labelled "Start") will resume data collection.</p>
						<p><b>Warning:</b> Any data sent while the service is stopped will not be displayed once it has been started again.</p>						
						<br>
						<p><a href="index.php">Back to Help</a></li><p>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>