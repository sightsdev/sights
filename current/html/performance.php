<html>
	<head>
		<link rel="stylesheet" href="assets/bootstrap.css">
		<link rel="stylesheet" href="assets/style.css">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>
	<body>
<?php
function get_server_memory_usage(){ //get RAM usage function
	//execute the command and put the result in the freeRam variable
	$freeRAM = shell_exec("echo $(vmstat 1 2|tail -1|awk '{print $4}')");
	$megabytes = 3963 - round($freeRAM/1000);//Calculate MB used from MB free
	return $megabytes;//Return the result
}
function get_server_cpu_usage(){//get CPU usage function
	//execute the shell command and put the result in the freeCPU variab;e
	$freeCPU = shell_exec("echo $(vmstat 1 2|tail -1|awk '{print $15}')"); 
	return 100 - $freeCPU;//Calculate and return CPU used
}
function get_cpu_temperature(){//get CPU temperature function
	//execute the shell command and put the result in the tempString variable
	$tempString = shell_exec("echo $(cat /sys/class/thermal/thermal_zone0/temp)"); 
	return $tempString;//return the temperature of the CPU
}
?>
		<div class="container">
			<div class="row">
				<div class="col-md-3">
					<div class="c100 p<?php echo round((get_server_memory_usage()/3963)*100); ?> big orange">
						<span><?php echo get_server_memory_usage(); ?>MB</span>
						<div class="slice">
							<div class="bar"></div>
							<div class="fill"></div>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="c100 p<?php echo get_server_cpu_usage(); ?> big orange">
						<span><?php echo get_server_cpu_usage(); ?>%</span>
						<div class="slice">
							<div class="bar"></div>
							<div class="fill"></div>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="c100 p<?php echo round(get_cpu_temperature()/1000); ?> big orange">
						<span><?php echo get_cpu_temperature()/1000; ?>°C</span>
						<div class="slice">
							<div class="bar"></div>
							<div class="fill"></div>
						</div>
					</div>
				</div>
			</div>
		</div>		
	</body>
</html>
