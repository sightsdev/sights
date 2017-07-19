var ip = window.location.hostname;

var performanceSocket = new WebSocket(ip + ":5558");

performanceSocket.onmessage = function(event){

var str = event.data;

var performanceArray = str.split(' '),
    usedRam = Math.round(performanceArray[0]), totalRam = Math.round(performanceArray[1]), cpu = Math.round(performanceArray[2]), cpuTemp = Math.round(performanceArray[3], upseconds = Math.round(performanceArray[4]);
	
if (ram < 1024) {
	document.getElementById("ram").innerHTML = usedRam + " MB";
}
else {
	document.getElementById("ram").innerHTML = (usedRam/1024).toFixed(2) + " GB";
}

document.getElementById("ramPercentage").className = "c100 big orange p" + Math.round((usedRam/totalRam)*100);

document.getElementById("cpu").innerHTML = cpu + "%";
document.getElementById("cpuPercentage").className = "c100 big orange p" + cpu;

document.getElementById("cpuTemp").innerHTML = cpuTemp + "%";
document.getElementById("cpuTempPercentage").className = "c100 big orange p" + cpuTemp;

document.getElementById("uptime").innerHTML = new Date(1000 * upseconds).toISOString().substr(11, 8) + "";
}
