<!DOCTYPE html>
<html>
	<!--#########################################################
	# Created by the Semi Autonomous Rescue Team				#
	#															#
	# Author: Jack Williams, Connor Kneebone					#
	#															#
	# Licensed under GNU General Public License 3.0				#
	##########################################################-->

	<title>S.A.R.T. Interface</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link CSS and scripts-->
		<link rel="shortcut icon" href="css/favicon.ico" type="image/x-icon" />
		
		<link rel="stylesheet" href="css/bootstrap.css">
		<!--link rel="stylesheet" href="css/style.css"-->
		<link rel="stylesheet" href="css/circle.css">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery-ui.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/Chart.bundle.js"></script>
		
		<script src="js/sart.gamepad.js"></script>
		<!--script src="js/sart.socket.js"></script-->

		<script>
		$(document).ready(function(){
			$(".modal-dialog").draggable({
				handle: ".modal-header"
			});
		});
		</script>
	</head>

	<body>

		
		<!--   _                 _           _                   
			  | |               | |         | |                  
			  | |_   _ _ __ ___ | |__   ___ | |_ _ __ ___  _ __  
		  _   | | | | | '_ ` _ \| '_ \ / _ \| __| '__/ _ \| '_ \ 
		 | |__| | |_| | | | | | | |_) | (_) | |_| | | (_) | | | |
		  \____/ \__,_|_| |_| |_|_.__/ \___/ \__|_|  \___/|_| |_|-->
		  
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
			<span>
				<span style="color: #FF5A00">S.A.R.T.</span> Control Interface
			</span>
			<div class="collapse navbar-collapse" id="navbarNav">
				
				
			</div>
			<span class="inline" id="start">Press a button on your controller to start</span>
		</nav>
		<div class="container-fluid">
			<br/>
			<div class="row justify-content-md-center no-gutters">
				<div class="col-md-auto ">
					<div class="card" style="border: 0px">
						<img width="" id="camera_left" class="img-fluid" src="http://10.0.2.4:8083"/>
					</div>
				</div>
				
				<div class="col-md-auto">
					<div class="card" style="border: 0px">
						<img width="" id="camera_front" class="img-fluid" src="http://10.0.2.4:8081"/>
					</div>
				</div>
				
				<div class="col-md-auto">
					<div class="card" style="border: 0px">
						<img width="" id="camera_right" class="img-fluid" src="http://10.0.2.4:8082"/>
					</div>
				</div>
			</div>
			<div class="row justify-content-md-center">
				<div class="col-md-auto">
					<br/>
					<div class="row">
						<div class="card">
							<div class="card-body">
								<div id="cpuTempPercentage" class="c100 p0 med orange">
									<span id="cpuTemp">0°C</span>
									<div class="slice">
										<div class="bar"></div>
										<div class="fill"></div>
									</div>
								</div>
							</div>
							<div class="card-header">
								<span>CPU Temperature</span><br/>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="card">
							<div class="card-body">
								<div id="cpuPercentage" class="c100 p0 med orange">
									<span id="cpu">0%</span>
									<div class="slice">
										<div class="bar"></div>
										<div class="fill"></div>
									</div>
								</div>
							</div>
							<div class="card-header">
								<span>CPU Percent</span><br/>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-auto">
					<div class="card" style="border: 0px">
						<img id="camera_back" src="http://10.0.2.4:8084"/>
					</div>
				</div>
				<div class="col-md-auto">
					<br/>
					<div class="row">
						<div class="card">
							<div class="card-body">
								<div id="ramPercentage" class="c100 p0 med orange">
									<span id="ram">0MB</span>
									<div class="slice">
										<div class="bar"></div>
										<div class="fill"></div>
									</div>
								</div>
							</div>
							<div class="card-header">
								<span>RAM Usage</span><br/>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="card">
							<div class="card-body">
								<div id="chargePercentage" class="c100 p0 med orange">
									<span id="charge">0%</span>
									<div class="slice">
										<div class="bar"></div>
										<div class="fill"></div>
									</div>
								</div>
							</div>
							<div class="card-header">
								<span>Charge Remaining</span><br/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<script src="js/sart.performance.js"></script>
	</body>
</html>
