<!DOCTYPE html>
<html>
	<title>Shutting Down</title><!--The title displayed in the browser tab bar-->
	<head>
		<!--Link Bootstrap-->
		<link rel="stylesheet" href="assets/style.css">
		<link rel="stylesheet" href="assets/bootstrap.css">
		<!--Link the favicon-->
		<link rel="shortcut icon" href="assets/favicon.ico" type="image/x-icon" />
	</head>
	<body>
		<div class="loader"><!--Create a div that can be referenced in CSS-->
			<img src="assets/image/loader.gif" /><!--Link to the preloader gif-->
			<h3>Shutting Down the S.A.R.T</h3>
			<br>
			<p>You may close this page at any time</p>
		</div>

<!--Check if device is connected to a network before redirecting to main page-->
<script language="javascript" type="text/javascript">
	var request = new XMLHttpRequest();
request.open("GET", "shutdownscript.php", true);<!--Open restart.php to restart the S.A.R.T-->
request.send(null);
</script>
	</body>
</html>