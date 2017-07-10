<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	</head>
	<body>
		<div class="rawdata">
<?php
$dataString = shell_exec("sudo cat /var/log/syslog");
echo nl2br($dataString);
?>
		</div>
	</body>
</html>

<!--http://stackoverflow.com/questions/16864221/accessing-var-log-files-from-php-->