/*###########################################################
# Created by the Semi Autonomous Rescue Team				#
#															#
# Author: Jack Williams										#
# Contributors: Jack Williams								#
#															#
# Licensed under GNU General Public License 3.0				#
###########################################################*/

var ip = window.location.hostname;

var performanceSocket = new WebSocket("ws://" + ip + ":5558");

performanceSocket.onmessage = function(event){

	var str = event.data;
	
	/*
	memory_total
	memory_used
	cpu_percent
	highest_temp
	uptime
	*/
	
	//This stuff here does a lot of fancy maths to make sure that any device can be used and statistics should report correctly. If there is a problem with a specific piece of hardware, please contact me (Jack Williams) with the problem and the specifications of the hardware you are using.
	var performanceArray = str.split(','),
		totalRam = Math.round(performanceArray[0]/1048576), usedRam = Math.round(performanceArray[1]/1048576), cpu = Math.round(performanceArray[2]), cpuTemp = Math.round(performanceArray[3]), upseconds = Math.round(performanceArray[4]);

	//Fancy stuff to display in megabytes if the used RAM is less than a gigabyte.
	if (usedRam < 1024) {
		document.getElementById("ram").innerHTML = usedRam + " MB";
	}
	else {
		document.getElementById("ram").innerHTML = (usedRam/1024).toFixed(2) + " GB";
	}

	document.getElementById("ramPercentage").className = "c100 big orange p" + Math.round((usedRam/totalRam)*100);

	document.getElementById("cpu").innerHTML = cpu + "%";
	document.getElementById("cpuPercentage").className = "c100 big orange p" + cpu;

	document.getElementById("cpuTemp").innerHTML = cpuTemp + "&degC";
	document.getElementById("cpuTempPercentage").className = "c100 big orange p" + cpuTemp;

	document.getElementById("uptime").innerHTML = new Date(1000 * upseconds).toISOString().substr(11, 8) + "";
}
