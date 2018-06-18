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
			<div class="row justify-content-md-center">
				<div class="col-md-auto">
					<div class="card">
						<img width="576" src="images/test.png"/>
					</div>
				</div>
			</div>
			<br/>
			<div class="row justify-content-md-center">
				<div class="col">
					<div class="card">
						<img width="" class="img-fluid" src="images/test.png"/>
					</div>
				</div>
				
				<div class="col">
					<div class="card">
						<img width="" class="img-fluid" src="images/test.png"/>
					</div>
				</div>
				
				<div class="col">
					<div class="card">
						<img width="" class="img-fluid" src="images/test.png"/>
					</div>
				</div>
			</div>
		</div>
		
	</body>
</html>