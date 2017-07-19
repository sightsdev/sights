<?php
function get_ip(){
	return shell_exec("echo $(hostname -I)");
}
?>
<!DOCTYPE html>
<html>
	<title>Help - SSH</title><!--The title displayed in the browser tab bar-->
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
						<h3>SSH</h3>
						<p>The SSH console allows you to run any command on the S.A.R.T robot.</p>
						<p>The SSH console might not work the first time you try it on a new device due to an invalid certificate. To fix this, visit the console directly at {ip}:4200 and click "proceed" to bypass the "Your connection is not private" screen. 
						</p>						
						<h3>Troubleshooting</h3>
						<h4><b>SSH console doesn't accept my input</b></h4>
						<p>You may need to focus the window. Open the SSH console and click anywhere inside the border. You can log in and run your commands.</p>
						<br>
						<h4><b>SSH console is white</b></h4>
						<p>This happens when the SSH console hasn't fully loaded. While it will still work, you can fix this by clicking "Open New Terminal".</p>
						<p>If the issue persists, the IP of the S.A.R.T has changed. You will need to visit this page (<a href="http://<?php echo get_ip(); ?>:4200"><?php echo get_ip(); ?>:4200</a> and click "proceed" to bypass the "Your connection is not private" screen.</p>
						<br>
						<h4><b>Other</b></h4>
						<p>Most SSH console issues can be fixed by clicking the "Open New Terminal" button. Refreshing the main page will also open a new instance of the console.</p>
						<p>If a command you entered in the SSH console has rendered the S.A.R.T unresponsive, you can attempt to restart the device.</p>
						<br>
						<p><a href="index.php">Back to Help</a></li><p>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>