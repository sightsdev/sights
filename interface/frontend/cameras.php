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
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				
				
			</div>
			<div class="inline">
				<!--div class="btn-group btn-group-lg" role="group"-->
					<button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#sshModal" >
						SSH
					</button>
					<button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#logModal" >
						Logs
					</button>
					<button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#dataModal" >
						Raw Data
					</button>
					<div class="btn-group dropleft" role="group">
						<button id="powerButtonDropdown" type="button" class="btn btn-outline-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Power
						</button>
						<div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
							<a class="dropdown-item" href="#">Shutdown</a>
							<a class="dropdown-item" href="#">Reboot</a>
						</div>
					</div>
				<!--/div-->
			</div>
		</nav>
		<br/>
		<div class="container">
			<div class="row">
				<div class="col">
					<div class="card">
						<div class="card-header">
							Front
						</div>
						<div class="card-body">
							<canvas id="distChart" width="400" height="200"></canvas>
						</div>
					</div>
				</div>
			</div>
			<br/>
			<div class="row">
				<div class="col">
					<div class="card">
						<div class="card-header">
							CO<sub>2</sub> Level<br/>
						</div>
						<div class="card-body">
							<div id="tvocGraph" class="c100 p55 medium orange">
								<span id="tvoc">55 ppm</span>
								<div class="slice">
									<div class="bar"></div>
									<div class="fill"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="col">
					<div class="card">
						<div class="card-header">
							TVOC Level
						</div>
						<div class="card-body">
							<div id="tvocGraph" class="c100 p69 medium orange">
								<span id="tvoc">69 ppb</span>
								<div class="slice">
									<div class="bar"></div>
									<div class="fill"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</body>
</html>