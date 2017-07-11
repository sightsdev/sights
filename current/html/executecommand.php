<?php
	$out = exec("python /home/pi/controlscripts/" . $_GET['command'] . "py " . $_GET['speed'] . " " . $_GET['duration']);
		echo $out;
	syslog(LOG_NOTICE, "executecommand with direction " . $_GET['command'] . " and speed " . $_GET['speed'] . " and duration " . $_GET['duration']);
?>