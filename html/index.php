<!DOCTYPE html>
<html>
	<title>S.A.R.T Interface</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link CSS and scripts-->
		<link rel="stylesheet" href="assets/bootstrap.css">
		<link rel="stylesheet" href="assets/style.css">
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
		<link rel="stylesheet" href="assets/circle.css">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="assets/jquery.min.js"></script>
		<script src="assets/bootstrap.min.js"></script>
		<script src="controlscript.php"></script>
	</head>

	<body onLoad="doUptime();">
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
			<div class="modal fade" id="sshModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-ssh.png"/>
							<h4 class="modal-title">SSH Console</h4>
						</div>
						<div class="modal-body">
							<iframe id="sshiframe" src="http://<?php echo $_SERVER['SERVER_ADDR'] ?>:4200" width="100%" height="400px"></iframe>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" onclick="refreshSSH();">Open New Terminal</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
							<div class="modal-float-left">
								<p>To log in, type <b>sart</b> and then type <b>sart99</b> when prompted.<p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--  ____        _    __      ___               
				 |  _ \      | |   \ \    / (_)              
				 | |_) | __ _| |_   \ \  / / _  _____      __
				 |  _ < / _` | __|   \ \/ / | |/ _ \ \ /\ / /
				 | |_) | (_| | |_     \  /  | |  __/\ V  V / 
				 |____/ \__,_|\__|     \/   |_|\___| \_/\_/  -->
			<div class="modal fade" id="sonarModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-sonar.png"/>
							<h4 class="modal-title">BatView &#174 Sonar Viewer</h4>
						</div>
						<div class="modal-body">
							<p>sonar view iframe</p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Save Screenshot</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
			<div class="modal fade" id="streamModal" role="dialog">
				<div class="modal-dialog modal-lg"><!--Bootstrap: Large modal-->
					<div class="modal-content">
						<div class="modal-header"><!-- Modal header -->
							<button type="button" class="close" data-dismiss="modal">&times;</button><!--Add a small close button (x)-->
							<img src="assets/image/circle-stream.png"/><!--Add a small icon to the header-->
							<h4 class="modal-title">Video Stream</h4><!--Add a title to the header-->
						</div>
						<div class="modal-body"><!--Modal body, where all the content goes-->
							<div class="stream">
								<img id="streamImage" src="http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8081/"/><!--IP and port of the stream-->
							</div>
						</div>
						<div class="modal-footer"><!-- Footer of the modal (where any buttons go) -->

							<button type="button" class="btn btn-default" onclick="refreshStream();">Refresh</button>
							<button type="button" class="btn btn-default" onclick="snapshot();">Take Snapshot</button>
							<button type="button" class="btn btn-default" onclick="recordEvent();">Record Event</button>
							<button type="button" class="btn btn-default" data-toggle="modal" data-target="#streamSettingsModal">Settings</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
			<div class="modal fade" id="streamSettingsModal" role="dialog">
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
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
			<div class="modal fade" id="rawdataModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-ssh.png"/>
							<h4 class="modal-title">Raw Data</h4>
						</div>
						<div class="modal-body">
							<div class="scroller" style="overflow-y:scroll; overflow-x:hidden; height:400px;">
								<object id="rawDataObj" width="600" height="400">
    Click "Refresh" to load raw data.
							</object>
							</div>
						</div>
						<div class="modal-footer">
						<button type="button" class="btn btn-default" onclick="doRawDataReload();">Refresh</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Clear</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
							<button type="button" class="btn btn-default" data-dismiss="modal" onclick="location.href='restart.php';">Restart</button>
							<button type="button" class="btn btn-default" data-toggle="modal" data-target="#shutdownYesNoModal">Shut Down</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
						</div>
					</div>
				</div>
			</div>
			
			<div class="modal fade" id="shutdownYesNoModal" role="dialog">
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
							<button type="button" class="btn btn-default" data-dismiss="modal" onclick="location.href='shutdown.php';">Shut Down</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
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
			<div class="modal fade" id="aboutModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-info.png"/>
							<h4 class="modal-title">About the S.A.R.T Control Interface</h4>
						</div>
						<div class="modal-body">
							<h4>A Web Control Interface for the S.A.R.T Robot</h4>
							<p>Version 0.2.0</p>
							<p>Developed by Jack Williams</p>
							<br>
							<br>
							<p>Current S.A.R.T IP: <?php echo $_SERVER['SERVER_ADDR'] ?></p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default"aids onclick="location.href='help/index.php';" data-dismiss="modal">Help</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<!--_____      _   _   _                     __  __           _       _ 
			   / ____|    | | | | (_)                   |  \/  |         | |     | |
			  | (___   ___| |_| |_ _ _ __   __ _ ___    | \  / | ___   __| | __ _| |
			   \___ \ / _ \ __| __| | '_ \ / _` / __|   | |\/| |/ _ \ / _` |/ _` | |
			   ____) |  __/ |_| |_| | | | | (_| \__ \   | |  | | (_) | (_| | (_| | |
			  |_____/ \___|\__|\__|_|_| |_|\__, |___/   |_|  |_|\___/ \__,_|\__,_|_|
										    __/ |                                 
										   |___/-->
			<div class="modal fade" id="settingsModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<img src="assets/image/circle-settings.png"/>
							<h4 class="modal-title">Settings</h4>
						</div>
						<div class="modal-body">
							<h4>Change multiple S.A.R.T settings via the Control Interface</h4>
							<br>
							<div class="container">
								<div class="row">
									<div class="col-md-3">
										<label for="videoStreamFramerateInput">Video Stream Framerate</label>
										<div class="input-group">
											<input type="text" id="videoStreamFramerateInput" class="form-control" placeholder="30" aria-describedby="basic-addon2">
											<span class="input-group-addon" id="basic-addon2">FPS</span>
										</div>
									</div>
									<div class="col-md-3">
										<label for="sonarMapStreamFramerateInput">Sonar Map Stream Framerate</label>
										<div class="input-group">
											<input type="text" id="sonarMapStreamFramerateInput" class="form-control" placeholder="5" aria-describedby="basic-addon2">
											<span class="input-group-addon" id="basic-addon2">FPS</span>
										</div>
									</div>
									<div class="col-md-3">
										<label for="accelerometerStreamFramerateInput">Accelerometer Stream Framerate</label>
										<div class="input-group">
											<input type="text" id="accelerometerStreamFramerateInput" class="form-control" placeholder="5" aria-describedby="basic-addon2">
											<span class="input-group-addon" id="basic-addon2">FPS</span>
										</div>
									</div>
								</div>
								<p>Lower framerates can reduce network strain, power consumption and CPU usage.</p>
							</div>
							<br>
							<div class="container">
								<div class="row">
									<div class="col-md-4">
										<div class="form-group">
											<label for="runProgramSelector">Run Program on Startup</label>
											<select class="form-control" id="runProgramSelector">
											<option>line follow.py</option>
											<option>control by ps3.py</option>
											<option>web interface control.py</option>
											<option>None</option>
											</select>
										</div>
									</div>
									<div class="col-md-4">
										<div class="form-group">
											<label for="runSecondProgramSelector">Run Second Program on Startup</label>
											<select class="form-control" id="runSecondProgramSelector">
											<option>line follow.py</option>
											<option>control by ps3.py</option>
											<option>web interface control.py</option>
											<option>None</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<br>
							<div class="container">
								<div class="row">
									<div class="col-md-3">
										<div class="form-group">
											<label for="fullBatteryAction">Power Plan</label>
											<select class="form-control" id="fullBatteryAction">
											<option>Maximum Performance</option>
											<option>Balanced</option>
											<option>Power Saver</option>
											</select>
										</div>
									</div>
									<div class="col-md-3">
										<div class="form-group">
											<label for="lowBatteryAction">Low Battery Action</label>
											<select class="form-control" id="lowBatteryAction">
											<option>Low Power Mode</option>
											<option>Shut Down</option>
											<option>Do Nothing</option>
											</select>
										</div>
									</div>
									<div class="col-md-3">
										<div class="form-group">
											<label for="criticalBatteryAction">Critical Battery Action</label>
											<select class="form-control" id="criticalBatteryAction">
											<option>Low Power Mode</option>
											<option>Shut Down</option>
											<option>Do Nothing</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Ok</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
							<button type="button" class="btn btn-default">Apply</button>
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
		<div class="nav">
			<div class="container">
				<ul>
					<li><br></li>
					<li><a href="#">Home</a></li>
					<li><strong>|</strong></li>
					<li><a href="help/index.php">Help</a></li>
					<li><a href="#"><span id="controlFeedback" style="position: absolute; right: 200px">Stationary</span></a></li>
				</ul>
			</div>
		</div>
		
		<!--       _                 _           _                   
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
				<!--   _____      _                          ____             
				      / ____|    | |                        / __ \            
					 | |     ___ | |_   _ _ __ ___  _ __   | |  | |_ __   ___ 
				     | |    / _ \| | | | | '_ ` _ \| '_ \  | |  | | '_ \ / _ \
					 | |___| (_) | | |_| | | | | | | | | | | |__| | | | |  __/
					  \_____\___/|_|\__,_|_| |_| |_|_| |_|  \____/|_| |_|\__-->
					<div class="col-md-3">
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" onclick="location.href='undefined.php';">
								<img src="assets/image/circle-console.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-console.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Not Set</p>
						</div>
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#sshModal">
								<img src="assets/image/circle-ssh.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-ssh.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">SSH</p>
						</div>
					</div>
                <!--   _____      _                         _______            
                      / ____|    | |                       |__   __|           
					 | |     ___ | |_   _ _ __ ___  _ __      | |_      _____  
					 | |    / _ \| | | | | '_ ` _ \| '_ \     | \ \ /\ / / _ \ 
					 | |___| (_) | | |_| | | | | | | | | |    | |\ V  V / (_) |
					  \_____\___/|_|\__,_|_| |_| |_|_| |_|    |_| \_/\_/ \__-->
					<div class="col-md-3">
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#streamModal">
								<img src="assets/image/circle-stream.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-stream.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Video Stream</p>
						</div>
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#sonarModal">
								<img src="assets/image/circle-sonar.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-sonar.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Sonar</p>
						</div>
					</div>
                
				<!--   _____      _                         _______ _                   
                      / ____|    | |                       |__   __| |                  
					 | |     ___ | |_   _ _ __ ___  _ __      | |  | |__  _ __ ___  ___ 
					 | |    / _ \| | | | | '_ ` _ \| '_ \     | |  | '_ \| '__/ _ \/ _ \
					 | |___| (_) | | |_| | | | | | | | | |    | |  | | | | | |  __/  __/
					  \_____\___/|_|\__,_|_| |_| |_|_| |_|    |_|  |_| |_|_|  \___|\__-->
					<div class="col-md-3">
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#rawdataModal">
								<img src="assets/image/circle-rawdata.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-rawdata.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Raw Data</p>
						</div>
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#settingsModal">
								<img src="assets/image/circle-settings.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-settings.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">Settings</p>
						</div>
					</div>
                <!--   _____      _                         ______               
				      / ____|    | |                       |  ____|              
					 | |     ___ | |_   _ _ __ ___  _ __   | |__ ___  _   _ _ __ 
					 | |    / _ \| | | | | '_ ` _ \| '_ \  |  __/ _ \| | | | '__|
					 | |___| (_) | | |_| | | | | | | | | | | | | (_) | |_| | |   
					  \_____\___/|_|\__,_|_| |_| |_|_| |_| |_|  \___/ \__,_-->
					<div class="col-md-3">
						<div class="thumbnail">
							<button type="button" class="btn btn-info btn-lg" onclick="window.open('/mftp/');">
								<img src="assets/image/circle-ftp.png" width="128px" onmouseover="this.src='assets/image/circle-rollover.png'" onmouseout="this.src='assets/image/circle-ftp.png'" onmousedown="this.src='assets/image/circle-mousedown.png'" onmouseup="this.src='assets/image/circle-rollover.png'" />
							</button>
						</div>
						<div class="thumbnail">
							<p style="text-align: center">FTP File Access</p>
						</div>
							
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
<?php 
// format the uptime in case the browser doesn't support dhtml/javascript
// static uptime string
function format_uptime($seconds) {
  $secs = intval($seconds % 60);
  $mins = intval($seconds / 60 % 60);
  $hours = intval($seconds / 3600 % 24);
  $days = intval($seconds / 86400);
  
  if ($days > 0) {
    $uptimeString .= $days;
    $uptimeString .= (($days == 1) ? " day" : " days");
  }
  if ($hours > 0) {
    $uptimeString .= (($days > 0) ? ", " : "") . $hours;
    $uptimeString .= (($hours == 1) ? " hour" : " hours");
  }
  if ($mins > 0) {
    $uptimeString .= (($days > 0 || $hours > 0) ? ", " : "") . $mins;
    $uptimeString .= (($mins == 1) ? " minute" : " minutes");
  }
  if ($secs > 0) {
    $uptimeString .= (($days > 0 || $hours > 0 || $mins > 0) ? ", " : "") . $secs;
    $uptimeString .= (($secs == 1) ? " second" : " seconds");
  }
  return $uptimeString;
}

// read in the uptime (using exec)
$uptime = exec("cat /proc/uptime");
$uptime = split(" ",$uptime);
$uptimeSecs = $uptime[0];

// get the static uptime
$staticUptime = "".format_uptime($uptimeSecs);

?>
						<script language="javascript">
<!--
var upSeconds=<?php echo $uptimeSecs; ?>;//Get the current uptime from the PHP script
function doUptime() {
	var uptimeString = "";//Create an empty string
	var secs = parseInt(upSeconds % 60);
	var mins = parseInt(upSeconds / 60 % 60);
	var hours = parseInt(upSeconds / 3600 % 24);
	var days = parseInt(upSeconds / 86400);
	if (days > 0) {
		uptimeString += days;
		uptimeString += ((days == 1) ? " day" : " days");
	}
	if (hours > 0) {
		uptimeString += ((days > 0) ? ", " : "") + hours;
		uptimeString += ((hours == 1) ? " hour" : " hours");
	}
	if (mins > 0) {
		uptimeString += ((days > 0 || hours > 0) ? ", " : "") + mins;
		uptimeString += ((mins == 1) ? " minute" : " minutes");
	}
	if (secs > 0) {
		uptimeString += ((days > 0 || hours > 0 || mins > 0) ? ", " : "") + secs;
		uptimeString += ((secs == 1) ? " second" : " seconds");
	}
	var span_el = document.getElementById("uptime");
	var replaceWith = document.createTextNode(uptimeString);
	span_el.replaceChild(replaceWith, span_el.childNodes[0]);
	upSeconds++;//Add 1 second to the uptime

	setTimeout("doUptime()",1000);//Perform the doUptime function every second
}

function doPerformanceReload() {
	var new_url = 'performance.php';
	$('#performanceObj').attr('data', new_url);
	$('#performanceObj').load(new_url);

	setTimeout("doPerformanceReload()",1000);	
}

function doRawDataReload() {
	var new_url2 = 'rawdata.php';
	$('#rawDataObj').attr('data', new_url2);
	$('#rawDataObj').load(new_url2);
}

$(window).load(function() {
	setTimeout(5000)
	doPerformanceReload();
})
// -->

function refreshStream()
{
 document.getElementById('streamImage').src = "http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8081/?time="+new Date().getTime();
}
function refreshSSH()
{
 document.getElementById('sshiframe').src += '';
}
function snapshot()
{
 $.get("http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8080/0/action/snapshot");
 setTimeout(function()
 {
  window.open("http://<?php echo $_SERVER['SERVER_ADDR'] ?>/downloadsnapshot.php");
 }, 2000);
}
function recordEvent()
{
 $.get("http://<?php echo $_SERVER['SERVER_ADDR'] ?>:8080/0/action/makemovie");
}
</script>
		<div class="page-content">
			<div class="container">
				<div class="row">
					<div class="col-md-3">
						<h3>RAM Usage</h3>
					</div>
					<div class="col-md-3">
						<h3>CPU Usage</h3>
					</div>
					<div class="col-md-3">
						<h3>CPU Temperature</h3>
					</div>
					<div class="col-md-3">
						<h3>Charge Remaining</h3>
					</div>
				</div>
			</div>
			<div class="container">
				<div class="row">					
					<div class="col-md-9">
						<div class="performance">
							<object id="performanceObj" width="600" height="400">
    Loading Performance Information...
							</object>

						</div>
					</div>
					<div class="col-md-3">
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
						<div id="uptime" style="font-weight:bold;"><?php echo $staticUptime; ?></div>
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
                <iframe id="hiddenIframe" src="" style="width:0;border:0;border:none;"></iframe>
	</body>
</html>