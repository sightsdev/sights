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
		
		<style>
		table {
		  width: 100%;
		}
		td {
		  width: 12.5%;
		  position: relative;
		}
		td:after {
		  content: '';
		  display: block;
		  margin-top: 100%;
		}
		td .content {
		  position: absolute;
		  top: 0;
		  bottom: 0;
		  left: 0;
		  right: 0;
		  background: gold;
		}
		</style>

		<script>
		$(document).ready(function(){
			$(".modal-dialog").draggable({
				handle: ".modal-header"
			});
		});
			
			</script>
	</head>

	<body>
	
		<div class="modal fade top" id="sshModal" role="dialog" data-backdrop="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header dragHeader" id="sshDrag">
						<h4 class="modal-title">SSH</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
					
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-warning btn-default" onclick="refreshSSH();">Refresh</button>
						<button type="button" class="btn btn-danger btn-default" data-dismiss="modal">&times; Close</button>
					</div>
				</div>
			</div>
		</div>

		<div class="modal fade top" id="logModal" role="dialog" data-backdrop="true">
			<div class="modal-dialog modal-lg" >
				<div class="modal-content">
					<div class="modal-header dragHeader" id="logDrag">
						<h4 class="modal-title">Logs</h4>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
					
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
		<!--div class="jumbotron" style="padding:2rem 2rem">
			<div class="row">
				<div class="col">
					<h1 class="display-5"><span style="color: #FF5A00">S.A.R.T.</span> Control Interface</h1>
					<p class="lead">Semi-Autonomous Rescue Team</p>
				</div>
				<div class="col">
					<div class="btn-group btn-group-lg" role="group">
						<button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#sshModal" >
							<img src="images/circle-ssh.png" class="img-fluid rounded-circle" width="75" height="75" style="padding-bottom:20px;">
							<h4>SSH</h4>
							
						</button>
						<button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#logsModal" >
							<img src="images/circle-log.png" class="img-fluid rounded-circle" width="75" height="75" style="padding-bottom:20px;">
							<h4>Logs</h4>
							
						</button>
						<button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#dataModal" >
							<img src="images/circle-rawdata.png" class="img-fluid rounded-circle" width="75" height="75" style="padding-bottom:20px;">
							<h4>Raw Data</h4>
							
						</button>
						<button type="button" class="btn btn-outline-danger" data-toggle="modal" data-target="#powerModal" >
							<img src="images/circle-power.png" class="img-fluid rounded-circle" width="75" height="75" style="padding-bottom:20px;">
							<h4>Power</h4>
							
						</button>
					</div>
				</div>
			</div>
		</div-->
		<br/>
		<div class="container">
			<div class="row">
				<div class="col-md-6">
					<div class="card">
						<div class="card-header">
							Distance
						</div>
						<div class="card-body">
							<canvas id="distChart" width="400" height="200"></canvas>
						</div>
					</div>
				</div>
				
				<div class="col-md-6">
					<div class="card">
						<div class="card-header">
							Temperature
						</div>
						<div class="card-body">
							<canvas id="tempChart" width="400" height="200"></canvas>
						</div>
					</div>
				</div>
			</div>
			<br/>
			<div class="row justify-content-md-center">
				<div class="col-md-auto">
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
				
				<div class="col-md-auto">
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
				
				<div class="col-md-auto">
					<div class="card">
						<div class="card-header">
							Thermal Camera
						</div>
						<div class="">
							<table>
								<tr>
									<td><div class="content" id="p1"></div></td>
									<td><div class="content" id="p2"></div></td>
									<td><div class="content" id="p3"></div></td>
									<td><div class="content" id="p4"></div></td>
									<td><div class="content" id="p5"></div></td>
									<td><div class="content" id="p6"></div></td>
									<td><div class="content" id="p7"></div></td>
									<td><div class="content" id="p8"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p9"></div></td>
									<td><div class="content" id="p10"></div></td>
									<td><div class="content" id="p11"></div></td>
									<td><div class="content" id="p12"></div></td>
									<td><div class="content" id="p13"></div></td>
									<td><div class="content" id="p14"></div></td>
									<td><div class="content" id="p15"></div></td>
									<td><div class="content" id="p16"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p17"></div></td>
									<td><div class="content" id="p18"></div></td>
									<td><div class="content" id="p19"></div></td>
									<td><div class="content" id="p20"></div></td>
									<td><div class="content" id="p21"></div></td>
									<td><div class="content" id="p22"></div></td>
									<td><div class="content" id="p23"></div></td>
									<td><div class="content" id="p24"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p25"></div></td>
									<td><div class="content" id="p26"></div></td>
									<td><div class="content" id="p27"></div></td>
									<td><div class="content" id="p28"></div></td>
									<td><div class="content" id="p29"></div></td>
									<td><div class="content" id="p30"></div></td>
									<td><div class="content" id="p31"></div></td>
									<td><div class="content" id="p32"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p33"></div></td>
									<td><div class="content" id="p34"></div></td>
									<td><div class="content" id="p35"></div></td>
									<td><div class="content" id="p36"></div></td>
									<td><div class="content" id="p37"></div></td>
									<td><div class="content" id="p38"></div></td>
									<td><div class="content" id="p39"></div></td>
									<td><div class="content" id="p40"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p41"></div></td>
									<td><div class="content" id="p42"></div></td>
									<td><div class="content" id="p43"></div></td>
									<td><div class="content" id="p44"></div></td>
									<td><div class="content" id="p45"></div></td>
									<td><div class="content" id="p46"></div></td>
									<td><div class="content" id="p47"></div></td>
									<td><div class="content" id="p48"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p49"></div></td>
									<td><div class="content" id="p50"></div></td>
									<td><div class="content" id="p51"></div></td>
									<td><div class="content" id="p52"></div></td>
									<td><div class="content" id="p53"></div></td>
									<td><div class="content" id="p54"></div></td>
									<td><div class="content" id="p55"></div></td>
									<td><div class="content" id="p56"></div></td>
								</tr>
								<tr>
									<td><div class="content" id="p57"></div></td>
									<td><div class="content" id="p58"></div></td>
									<td><div class="content" id="p59"></div></td>
									<td><div class="content" id="p60"></div></td>
									<td><div class="content" id="p61"></div></td>
									<td><div class="content" id="p62"></div></td>
									<td><div class="content" id="p63"></div></td>
									<td><div class="content" id="p64"></div></td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<br/>
		<!--div class="jumbotron">
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
						<div id="cpuTempPercentage" class="c100 p0 big orange">
							<span id="cpuTemp">0%</span>
							<div class="slice">
								<div class="bar"></div>
								<div class="fill"></div>
							</div>
						</div>						
					</div>
				</div>
			</div>
		</div-->

			<!--script>

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
			</script-->

		
		
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
		<script src="js/sart.sensors.js"></script>
		<!--script src="js/sart.performance.js"></script-->
		
	</body>
</html>
