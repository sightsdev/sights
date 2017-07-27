<!DOCTYPE html>
<html>
	<title>S.A.R.T Interface</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link CSS and scripts-->
		<link rel="shortcut icon" href="assets/favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" href="assets/bootstrap.css">
		<link rel="stylesheet" href="assets/style.css">
		<link rel="stylesheet" href="assets/circle.css">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="assets/jquery.min.js"></script>
		<script src="assets/bootstrap.min.js"></script>
		<script src="assets/drag-drop.min.js"></script>
	</head>

	<body>
	<!--  __  __           _       _     
		 |  \/  |         | |     | |    
		 | \  / | ___   __| | __ _| |___ 
		 | |\/| |/ _ \ / _` |/ _` | / __|
		 | |  | | (_) | (_| | (_| | \__ \
		 |_|  |_|\___/ \__,_|\__,_|_|___/-->
		<div class="container">
			<!--   _____ _____ _    _     __  __           _       _ 
				  / ____/ ____| |  | |   |  \/  |         | |     | |
				 | (___| (___ | |__| |   | \  / | ___   __| | __ _| |
				  \___ \\___ \|  __  |   | |\/| |/ _ \ / _` |/ _` | |
				  ____) |___) | |  | |   | |  | | (_) | (_| | (_| | |
				 |_____/_____/|_|  |_|   |_|  |_|\___/ \__,_|\__,_|_|-->
			<div class="modal fade top" id="sshModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header dragHeader" id="sshDrag">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-ssh.png"/>
							<h4 class="modal-title">SSH Console</h4>
						</div>
						<div class="modal-body">
							<iframe id="sshiframe" src="http://<?php echo $_SERVER['SERVER_ADDR'] ?>:4200" width="100%" height="400px"></iframe>
						</div>
						<div class="modal-footer">
							<p style="float:left;">To log in, focus the window, type <b>sart</b> and then type <b>sart99</b> when prompted.<p>
							<button type="button" class="btn btn-warning btn-default" onclick="refreshSSH();">Open New Terminal</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!-- _____ _____     _____  _     _                       
				|_   _|  __ \   |  __ \(_)   | |                      
				  | | | |__) |  | |  | |_ ___| |_ __ _ _ __   ___ ___ 
				  | | |  _  /   | |  | | / __| __/ _` | '_ \ / __/ _ \
				 _| |_| | \ \   | |__| | \__ \ || (_| | | | | (_|  __/
				|_____|_|  \_\  |_____/|_|___/\__\__,_|_| |_|\___\___|-->
			<div class="modal fade top" id="irModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header dragHeader" id="irDrag">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-ir.png"/>
							<h4 class="modal-title">IR Distance Viewer</h4>
						</div>
						<div class="modal-body">
							<p>IR Distance view iframe</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-warning btn-default" data-dismiss="modal">Save Screenshot</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!-- __      ___     _               _____ _                              __  __           _       _ 
				 \ \    / (_)   | |             / ____| |                            |  \/  |         | |     | |
				  \ \  / / _  __| | ___  ___   | (___ | |_ _ __ ___  __ _ _ __ ___   | \  / | ___   __| | __ _| |
				   \ \/ / | |/ _` |/ _ \/ _ \   \___ \| __| '__/ _ \/ _` | '_ ` _ \  | |\/| |/ _ \ / _` |/ _` | |
				    \  /  | | (_| |  __/ (_) |  ____) | |_| | |  __/ (_| | | | | | | | |  | | (_) | (_| | (_| | |
					 \/   |_|\__,_|\___|\___/  |_____/ \__|_|  \___|\__,_|_| |_| |_| |_|  |_|\___/ \__,_|\__,_|_|-->
			<div class="modal fade top" id="streamModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header dragHeader" id="streamDrag">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-stream.png"/>
							<h4 class="modal-title">Video Stream</h4>
						</div>
						<div class="modal-body">
							<div class="stream" id="flipY">
								<img id="streamImage" src="http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8081/"/>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-warning btn-default" onclick="refreshStream();">Refresh</button>
							<button type="button" class="btn btn-warning btn-default" onclick="snapshotStream();">Take Snapshot</button>
							<button type="button" class="btn btn-warning btn-default" onclick="recordStreamEvent();">Record Event</button>
							<button type="button" class="btn btn-warning btn-default" data-toggle="modal" data-target="#streamSettingsModal">Settings</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!--  _____               _    _               ____  _                            
				 |_   _| __ __ _  ___| | _(_)_ __   __ _  / ___|| |_ _ __ ___  __ _ _ __ ___  
				   | || '__/ _` |/ __| |/ / | '_ \ / _` | \___ \| __| '__/ _ \/ _` | '_ ` _ \ 
				   | || | | (_| | (__|   <| | | | | (_| |  ___) | |_| | |  __/ (_| | | | | | |
				   |_||_|  \__,_|\___|_|\_\_|_| |_|\__, | |____/ \__|_|  \___|\__,_|_| |_| |_|
												    |___/-->
			<div class="modal fade top" id="trackingStreamModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header dragHeader" id="trackingStreamDrag">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-tracking-stream.png"/>
							<h4 class="modal-title">Tracking Stream</h4>
						</div>
						<div class="modal-body">
							<div class="stream">
								<img id="trackingStreamImage" src="http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8081/"/>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!-- __      ___     _               _____ _  SETTINGS                    __  __           _       _ 
				 \ \    / (_)   | |             / ____| | SETTINGS                   |  \/  |         | |     | |
				  \ \  / / _  __| | ___  ___   | (___ | |_ _ __ ___  __ _ _ __ ___   | \  / | ___   __| | __ _| |
				   \ \/ / | |/ _` |/ _ \/ _ \   \___ \| __| '__/ _ \/ _` | '_ ` _ \  | |\/| |/ _ \ / _` |/ _` | |
				    \  /  | | (_| |  __/ (_) |  ____) | |_| | |  __/ (_| | | | | | | | |  | | (_) | (_| | (_| | |
					 \/   |_|\__,_|\___|\___/  |_____/ \__|_|  \___|\__,_|_| |_| |_| |_|  |_|\___/ \__,_|\__,_|_|-->
			<div class="modal fade" id="streamSettingsModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-stream.png"/>
							<h4 class="modal-title">Video Stream Settings</h4>
						</div>
						<div class="modal-body">
							<iframe id="streamSettingsiframe" src="http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8080" width="100%" height="400px"></iframe>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!--_____                  _____        _          __  __           _       _ 
			   |  __ \                |  __ \      | |        |  \/  |         | |     | |
			   | |__) |__ ___      __ | |  | | __ _| |_ __ _  | \  / | ___   __| | __ _| |
			   |  _  // _` \ \ /\ / / | |  | |/ _` | __/ _` | | |\/| |/ _ \ / _` |/ _` | |
			   | | \ \ (_| |\ V  V /  | |__| | (_| | || (_| | | |  | | (_) | (_| | (_| | |
			   |_|  \_\__,_| \_/\_/   |_____/ \__,_|\__\__,_| |_|  |_|\___/ \__,_|\__,_|_|-->
			<div class="modal fade top" id="rawdataModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header dragHeader" id="rawdataDrag">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-rawdata.png"/>
							<h4 class="modal-title">Raw Data</h4>
							<br>
						</div>
						<div class="modal-body">
							<div class="tab-content">
								<div class="container">
									<div class="row">
										<div class="col-md-3">
											<h4>Temperature</h4>
											<p><b>Ambient</b><br><span id="temperatureAmbient"></span> &degC </p>
										</div>
										<div class="col-md-3">
											<h4 style="color:#FFFFFF;">.</h4>
											<p><b>Object</b><br><span id="temperatureObject"></span> &degC </p>
										</div>
										<div class="col-md-6">
											<h4>Compass Bearing</h4>
											<p><span id="compassBearing"></span> &deg </p>
										</div>
									</div>
								</div>
								<div class="container">
									<div class="row">
										<h4>Accelerometer</h4>
										<div class="col-md-3">
											<p><b>X-Axis</b><br><span id="irFront"></span> ms^-2</p>
										</div>
										<div class="col-md-3">
											<p><b>Y-Axis</b><br><span id="irRight"></span> ms^-2</p>
										</div>
										<div class="col-md-3">
											<p><b>Z-Axis</b><br><span id="irRear"></span> ms^-2</p>
										</div>
									</div>
								</div>
								<div class="container">
									<div class="row">
										<h4>Infared Distance Sensors</h4>
										<div class="col-md-2">
											<p><b>Front (A0)</b><br><span id="irFront"></span> cm</p>
										</div>
										<div class="col-md-2">
											<p><b>Right (A1)</b><br><span id="irRight"></span> cm</p>
										</div>
										<div class="col-md-2">
											<p><b>Rear (A2)</b><br><span id="irRear"></span> cm</p>
										</div>
										<div class="col-md-2">
											<p><b>Left (A3)</b><br><span id="irLeft"></span> cm</p>
										</div>
									</div>
								</div>
								<div class="container">
									<div class="row">
										<h4>Servo Voltages</h4>
										<div class="col-md-2">
											<p><b>Servo 1 (Front Left)</b><br><span id="servoOneVoltage"></span> volts</p>
										</div>
										<div class="col-md-2">
											<p><b>Servo 2 (Front Right)</b><br><span id="servoTwoVoltage"></span> volts</p>
										</div>
										<div class="col-md-2">
											<p><b>Servo 3 (Rear Left)</b><br><span id="servoThreeVoltage"></span> volts</p>
										</div>
										<div class="col-md-2">
											<p><b>Servo 4 (Rear Right)</b><br><span id="ServoFourVoltage"></span> volts</p>
										</div>
									</div>
								</div>
								<div class="container">
									<div class="row">
										<h4>Servo Temperatures</h4>
										<div class="col-md-2">
											<p><b>Servo 1 (Front Left)</b><br><span id="servoOneTemperature"></span> &degC </p>
										</div>
										<div class="col-md-2">
											<p><b>Servo 2 (Front Right)</b><br><span id="servoTwoTemperature"></span> &degC </p>
										</div>
										<div class="col-md-2">
											<p><b>Servo 3 (Rear Left)</b><br><span id="servoThreeTemperature"></span> &degC </p>
										</div>
										<div class="col-md-2">
											<p><b>Servo 4 (Rear Right)</b><br><span id="servoFourTemperature"></span> &degC </p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!--  _____                           __  __           _       _ 
				 |  __ \                         |  \/  |         | |     | |
				 | |__) |____      _____ _ __    | \  / | ___   __| | __ _| |
				 |  ___/ _ \ \ /\ / / _ \ '__|   | |\/| |/ _ \ / _` |/ _` | |
				 | |  | (_) \ V  V /  __/ |      | |  | | (_) | (_| | (_| | |
				 |_|   \___/ \_/\_/ \___|_|      |_|  |_|\___/ \__,_|\__,_|_|-->
			<div class="modal fade" id="powerModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-power.png"/>
							<h4 class="modal-title">Power Options</h4>
						</div>
						<div class="modal-body">
							<p>Are you sure you want to power down?</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-warning btn-default" data-dismiss="modal" onclick="location.href='restart.php';">Restart</button>
							<button type="button" class="btn btn-warning btn-default" data-toggle="modal" data-target="#shutdownWarningModal">Shut Down</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Cancel</button>
						</div>
					</div>
				</div>
			</div>
			<!--Shut down warning modal-->
			<div class="modal fade middle-adjust" id="shutdownWarningModal" role="dialog">
				<div class="modal-dialog modal-sm">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-power.png"/>
							<h4 class="modal-title">Are you sure?</h4>
						</div>
						<div class="modal-body">
							<p>You will have to reboot the S.A.R.T manually.<br><br>Make sure you have access to the S.A.R.T and that it is not in the middle of a mission.</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-warning btn-default" data-dismiss="modal" onclick="location.href='shutdown.php';">Shut Down</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Cancel</button>
						</div>
					</div>
				</div>
			</div>
			<!--   _                 _       __  __           _       _ 
			 /\   | |               | |     |  \/  |         | |     | |
			/  \  | |__   ___  _   _| |_    | \  / | ___   __| | __ _| |
		   / /\ \ | '_ \ / _ \| | | | __|   | |\/| |/ _ \ / _` |/ _` | |
		  / ____ \| |_) | (_) | |_| | |_    | |  | | (_) | (_| | (_| | |
		 /_/    \_\_.__/ \___/ \__,_|\__|   |_|  |_|\___/ \__,_|\__,_|_|-->
			<div class="modal fade" id="aboutModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-info.png"/>
							<h4 class="modal-title">About the S.A.R.T Control Interface</h4>
						</div>
						<div class="modal-body">
							<h4>A Web Control Interface for the S.A.R.T Robot</h4>
							<p>Version 1.2.0</p>
							<p>Developed by Jack Williams</p>
							<br><br>
							<p>Current S.A.R.T IP: <?php echo $_SERVER['SERVER_ADDR'] ?></p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-warning btn-default" onclick="location.href='help/index.php';" data-dismiss="modal">Help</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
			<!--  _                   __  __           _       _ 
				 | |                 |  \/  |         | |     | |
				 | |     ___   __ _  | \  / | ___   __| | __ _| |
				 | |    / _ \ / _` | | |\/| |/ _ \ / _` |/ _` | |
				 | |___| (_) | (_| | | |  | | (_) | (_| | (_| | |
				 |______\___/ \__, | |_|  |_|\___/ \__,_|\__,_|_|
							   __/ |                             
							  |___/-->
			<div class="modal fade top" id="logModal" role="dialog" data-backdrop="false">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header dragHeader" id="logDrag">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-log.png"/>
							<h4 class="modal-title">Log</h4>
						</div>
						<div class="modal-body">
							<div id="log" class="tab-pane fade">
								<div class="logScroller" style="overflow-y:scroll; overflow-x:hidden; height:400px;">
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-warning btn-default" data-dismiss="modal">Clear</button>
							<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--  _   _             _             _   _             
		     | \ | |           (_)           | | (_)            
			 |  \| | __ ___   ___  __ _  __ _| |_ _  ___  _ __  
			 | . ` |/ _` \ \ / / |/ _` |/ _` | __| |/ _ \| '_ \ 
			 | |\  | (_| |\ V /| | (_| | (_| | |_| | (_) | | | |
			 |_| \_|\__,_| \_/ |_|\__, |\__,_|\__|_|\___/|_| |_|
								   __/ |                        
								  |___/-->
		<div class="nav topnav">
			<div class="container">
				<ul>
					<li><br></li>
					<li><a href="#"><span id="flipFeedback" style="position: absolute; left: 200px"></span></a></li>
					<li><a href="#">Home</a></li>
					<li><strong>|</strong></li>
					<li><a href="help/index.php">Help</a></li>
					<li><a href="#" onclick="reloadControlScript();"><span id="controlFeedback" style="position: absolute; right: 200px">Stationary</span></a></li>
				</ul>
			</div>
		</div>
		
			<!--   _                 _           _                   
				  | |               | |         | |                  
				  | |_   _ _ __ ___ | |__   ___ | |_ _ __ ___  _ __  
			  _   | | | | | '_ ` _ \| '_ \ / _ \| __| '__/ _ \| '_ \ 
			 | |__| | |_| | | | | | | |_) | (_) | |_| | | (_) | | | |
			  \____/ \__,_|_| |_| |_|_.__/ \___/ \__|_|  \___/|_| |_|-->
		<div class="jumbotron">
			<div class="container">
				<h1><span style="color: #FF5A00">S.A.R.T</span> <span style="color: #d8d8d8">Control Interface</span></h1>
			</div>
		</div>
		<div class="home-options">
			<div class="container">
				<div class="row">
					<div class="col-md-3">
					<!--SSH Terminal-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#sshModal">
								<img src="assets/image/circle-ssh.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-ssh.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">SSH Terminal</p>
						</div>
					</div>
					<div class="col-md-3">
					<!--Video Stream-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#streamModal">
								<img src="assets/image/circle-stream.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-stream.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Video Stream</p>
						</div>
					</div>
					<div class="col-md-3">
					<!--Video Stream-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#trackingStreamModal">
								<img src="assets/image/circle-tracking-stream.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-tracking-stream.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Tracking Stream</p>
						</div>
					</div>
					<div class="col-md-3">
					<!--IR Distance-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#irModal">
								<img src="assets/image/circle-ir.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-ir.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">IR Distance</p>
						</div>
					</div>
				</div>
			</div>
			<div class="container">
				<div class="row">
					<div class="col-md-3">
					<!--Raw Data-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#rawdataModal">
								<img src="assets/image/circle-rawdata.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-rawdata.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Raw Data</p>
						</div>
					</div>
					<div class="col-md-3">
					<!--Log-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#logModal">
								<img src="assets/image/circle-log.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-log.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Log</p>
						</div>
					</div>
					<div class="col-md-3">
					<!--FTP File Access-->
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" onclick="window.open('/mftp/');">
								<img src="assets/image/circle-ftp.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-ftp.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">FTP File Access</p>
						</div>
					</div>
					<div class="col-md-3">
					<!--Power Options-->
						<div class="thumbnail">
						<!-- Trigger the modal with a button -->
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#powerModal">
								<img src="assets/image/circle-power.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-power.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Power Options</p>
						</div>
					</div>
				</div>
			</div>
        </div>
		<!--  _____           __                                            _____        __                           _   _             
			 |  __ \         / _|                                          |_   _|      / _|                         | | (_)            
			 | |__) |__ _ __| |_ ___  _ __ _ __ ___   __ _ _ __   ___ ___    | |  _ __ | |_ ___  _ __ _ __ ___   __ _| |_ _  ___  _ __  
			 |  ___/ _ \ '__|  _/ _ \| '__| '_ ` _ \ / _` | '_ \ / __/ _ \   | | | '_ \|  _/ _ \| '__| '_ ` _ \ / _` | __| |/ _ \| '_ \ 
			 | |  |  __/ |  | || (_) | |  | | | | | | (_| | | | | (_|  __/  _| |_| | | | || (_) | |  | | | | | | (_| | |_| | (_) | | | |
			 |_|   \___|_|  |_| \___/|_|  |_| |_| |_|\__,_|_| |_|\___\___| |_____|_| |_|_| \___/|_|  |_| |_| |_|\__,_|\__|_|\___/|_| |_|-->
		<div class="page-content">
			<div class="container">
				<div class="row">
					<div class="col-md-3">
						<h3>RAM Usage</h3>
						<div id="ramPercentage" class="c100 p0 big orange">
							<span id="ram">0MB</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<h3>CPU Usage</h3>
						<div id="cpuPercentage" class="c100 p0 big orange">
							<span id="cpu">0%</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<h3>CPU Temperature</h3>
						<div id="cpuTempPercentage" class="c100 p0 big orange">
							<span id="cpuTemp">0°C</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>
					</div>
					<div class="col-md-3">
						<h3>Charge Remaining</h3>
						<div class="row">
							<div class="batcharge">
								<div class="col-md-6">									
									<h4>Battery</h4>
									<img src="assets/image/battery/80.png" width="128px"/>
								</div>
								<div class="col-md-6">
									<h4>Stats</h4>
									<p><b>Voltage:</b> 14.64v</p>
								</div>
							</div>
						</div>
						<h3>Uptime</h3>
						<div id="uptime" style="font-weight:bold;"></div>
						<br><br>						
					</div>
				</div>
				<!--  ______          _            
					 |  ____|        | |           
					 | |__ ___   ___ | |_ ___ _ __ 
					 |  __/ _ \ / _ \| __/ _ \ '__|
					 | | | (_) | (_) | ||  __/ |   
					 |_|  \___/ \___/ \__\___|_|-->
				<p>Site change log is available <a href="change-log.php">here</a></p>
				<div class="float-right">
					<p>Current IP: <?php echo $_SERVER['SERVER_ADDR'] ?>  -  <a data-target="#aboutModal" data-toggle="modal">About the S.A.R.T Interface</a></p>
				</div>
			</div>
		</div>
		<script src="assets/otherscript.js"></script>
		<script src="assets/controlscript.js"></script>
		<script src="assets/logscript.js"></script>
		<script src="assets/performancescript.js"></script>
	</body>
</html>