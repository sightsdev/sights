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
		<script src="js/drag-drop.min.js"></script>

		<script>
		$(document).ready(function(){
			$(".modal-dialog").draggable({
				handle: ".modal-header"
			});
		});
			
			</script>

		<script src="js/otherscript.js"></script>
		<script src="js/controlscript.js"></script>
		<script src="js/logscript.js"></script>
		<script src="js/performancescript.js"></script>
	</head>

	<body>

		<div class="modal fade top" id="tempModal" role="dialog" data-backdrop="false">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header dragHeader" id="sshDrag">
						<h4 class="modal-title">Temperature</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
					<canvas id="tempChart" width="400" height="200"></canvas>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-warning btn-default" onclick="refreshSSH();">Clear</button>
						<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade top" id="distModal" role="dialog" data-backdrop="false">
			<div class="modal-dialog modal-lg" >
				<div class="modal-content">
					<div class="modal-header dragHeader" id="sshDrag">
						<h4 class="modal-title">Distance</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
					<canvas id="distChart" width="400" height="200"></canvas>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-warning btn-default" onclick="refreshSSH();">Clear</button>
						<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
					</div>
				</div>
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
				<h1 class="display-4"><span style="color: #FF5A00">S.A.R.T.</span> Control Interface</h1>
				<p class="lead">Semi-Autonomous Rescue Team</p>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col">
					<button type="button" class="btn" data-toggle="modal" data-target="#sshModal" >
						<img src="images/circle-ssh.png" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200" style="padding-bottom:20px;">
						<h4>SSH Session</h4>
						<div class="text-muted">Open new SSH session</div>
					</button>
				</div>
				<div class="col">
					<button type="button" class="btn" data-toggle="modal" data-target="#sshModal" >
						<img src="images/circle-log.png" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200" style="padding-bottom:20px;">
						<h4>Logs</h4>
						<span class="text-muted">View system logs</span>
					</button>
				</div>
				<div class="col">
					<button type="button" class="btn" data-toggle="modal" data-target="#sshModal" >
						<img src="images/circle-rawdata.png" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200" style="padding-bottom:20px;">
						<h4>Raw Data</h4>
						<span class="text-muted">View servo, system and sensor data</span>
					</button>
				</div>
				<div class="col">
					<button type="button" class="btn" data-toggle="modal" data-target="#sshModal" >
						<img src="images/circle-power.png" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200" style="padding-bottom:20px;">
						<h4>Poweroff</h4>
						<span class="text-muted">Shutdown or reboot</span>
					</button>
				</div>
			</div>
			<br/>
			<div class="row">
				<div class="col">
					<button type="button" class="btn" data-toggle="modal" data-target="#distModal" >
						<img src="images/circle-ir.png" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200" style="padding-bottom:20px;">
						<h4>Distance</h4>
						<div class="text-muted">View distance</div>
					</button>
				</div>
				<div class="col">
					<button type="button" class="btn" data-toggle="modal" data-target="#tempModal" >
						<img src="images/circle-info.png" class="img-fluid rounded-circle" alt="Generic placeholder thumbnail" width="200" height="200" style="padding-bottom:20px;">
						<h4>Temp</h4>
						<span class="text-muted">View temperatures</span>
					</button>
				</div>
				<div class="card" style="width: 18rem;">
				<div class="card-body">
					<h5 class="card-title">Focus Camera</h5>
					<p class="card-text">Bring camera to focus on main screen</p>

					<div class="row">
						<div class="col-6 col-md-4"></div>
						<div class="col-6 col-md-4"><button type="button" class="btn btn-primary btn-block">Front</button></div>
						<div class="col-6 col-md-4"></div>
					</div>

					<!-- Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop -->
					<div class="row">
						<div class="col-6 col-md-4"><button type="button" class="btn btn-primary btn-block">Left</button></div>
						<div class="col-6 col-md-4"></div>
						<div class="col-6 col-md-4"><button type="button" class="btn btn-primary btn-block">Right</button></div>
					</div>

					<!-- Columns are always 50% wide, on mobile and desktop -->
					<div class="row">
						<div class="col-6 col-md-4"></div>
						<div class="col-6 col-md-4"><button type="button" class="btn btn-primary btn-block">Back</button></div>
						<div class="col-6 col-md-4"></div>
					</div>
				</div>
			</div>
			</div>
			
			<script>

			function rainbow(n) {
				return 'hsl(' + n * 15 + ',100%,50%)';
			}

			var ir_test = [
			  [20, 22, 23, 24, 25, 24, 23, 22],
			  [19, 20, 22, 23, 23, 24, 22, 21],
			  [19, 18, 22, 24, 22, 23, 22, 20],
			  [18, 17, 17, 18, 20, 23, 22, 21],
			  [17, 15, 15, 17, 19, 20, 22, 23],
			  [17, 14, 14, 17, 18, 19, 20, 22],
			  [18, 15, 15, 18, 20, 22, 23, 24],
			  [20, 19, 19, 20, 22, 23, 24, 25]
			];

			for (i = 0; i < 8; i++) {
				for (j = 0; j < 8; j++) {
					var offset = i * 8 + j;
					var pixel = ir_test[i][j];
					document.getElementById("p" + (offset + 1)).style = "background:" + rainbow(pixel);
				}
			}
			</script>

			<script>
			var tempChartCanvas = document.getElementById("tempChart").getContext('2d');
			var distChartCanvas = document.getElementById("distChart").getContext('2d');

		

			var distChartData = {
				labels: ['Front', 'Right', 'Back', 'Left'],
				datasets: [{
					data: [500, 244, 100, 800],
					backgroundColor: [
					"rgba(0, 255, 0, 0.8)",
					"rgba(0, 255, 200, 0.8)",
					"rgba(0, 255, 200, 0.8)",
					"rgba(0, 255, 200, 0.8)"
					],
					borderColor: "rgba(0, 0, 0, 0.5)"
				}]
			};

			var distChartOptions = {
				startAngle: 5 * Math.PI / 4,
				legend: {
					position: 'left',
					display: false
				},
				animation: {
					animateRotate: false
				},
				scale: {
					ticks: {
						max: 1200,
						min: 0,
						stepSize: 100
					}
				}
			};

			var distChart = new Chart(distChartCanvas, {
				type: 'polarArea',
				data: distChartData,
				options: distChartOptions
			});



			var tempChart = new Chart(tempChartCanvas, {
				type: 'line',
				data: {
					datasets: [{
						label: 'Sensor Front',
						data: [12, 19, 3, 5, 2, 3],
						borderColor: [
							'rgba(128, 0, 0, 1)'
						]
					},
					{
						label: 'Sensor Left',
						data: [22, 43, 13, 43, 22, 56],
						borderColor: [
							'rgba(0, 128, 0, 1)'
						]
					},
					{
						label: 'Sensor Right',
						data: [44, 11, 55, 3, 4, 1],
						borderColor: [
							'rgba(0, 0, 128, 1)'
						]
					},
					{
						label: 'Sensor Back',
						data: [42, 55, 22, 11, 22, 45],
						borderColor: [
							'rgba(128, 128, 0, 1)'
						]
					}]
				}
			});

			</script>
		</div>

		
		<!--div class="page-content" style="position:absolute;bottom:0;width:100%;padding-bottom:15px;background-color: #f5f5f5;">
			<div class="container">
				<p>
					<div class="float-left">Site change log is available <a href="change-log.php">here</a>
					</div>
					<div class="float-right">
						Current IP: <?php echo $_SERVER['SERVER_ADDR'] ?>  -  <a data-target="#aboutModal" data-toggle="modal">About the S.A.R.T Interface</a>
					</div>
				</p>
				
			</div>
		</div-->
		
	</body>
</html>