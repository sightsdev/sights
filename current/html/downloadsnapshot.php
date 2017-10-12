<?php
/*###########################################################
# Created by the Semi Autonomous Rescue Team				#
#															#
# Author: Jack Williams										#
# Contributors: Jack Williams								#
#															#
# Licensed under GNU General Public License 3.0				#
###########################################################*/

$file = '/tmp/motion/lastsnap.jpg';//Location of the file to download

if (file_exists($file)) {
	header('Content-Description: File Transfer');
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename='.basename($file));
	header('Content-Transfer-Encoding: binary');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Content-Length: ' . filesize($file));
	ob_clean();
	flush();
	readfile($file);
	exit;
}
?>