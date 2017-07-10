<?php

echo "Socket test\n";
$service_port = 5555;
$address = $_SERVER['SERVER_ADDR'];



$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);


if ($socket === false)
{
	echo "Error bad socket :( \n";
}
else
{
	echo "ok\n";
}

$result = socket_connect($socket, $address, $service_port);
if($result === false)
{
	echo "FAILED!!!!\n";
}
else{
	echo "ok.\n";

}


# send 2 bytes to the python socket
$packet = pack(a, 14);
socket_write($socket, $packet, 2);




?>