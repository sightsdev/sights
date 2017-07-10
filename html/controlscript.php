window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

var controlSocket = new WebSocket("ws://<?php echo $_SERVER['SERVER_ADDR'] ?>:5555");

var speed = 10;
var lastKey = 0;

function onKeyDown(event) {
  var key = event.keyCode;

  switch (key) {
    case 49: //1
      speed = 1;
      break;
    case 50: //2
      speed = 2;
      break;
    case 51: //3
      speed = 3;
      break;
    case 52: //4
      speed = 4;
      break;
    case 53: //5
      speed = 5;
      break;
    case 54: //6
      speed = 6;
      break;
    case 55: //7
      speed = 7;
      break;
    case 56: //8
      speed = 8;
      break;
    case 57: //9
      speed = 9;
      break;
    case 48: //0
      speed = 10;
      break;
    case 87: //w
      if(lastKey == 87) {
        break;
      } else {
        document.getElementById("controlFeedback").innerHTML = "Forward " + speed * 10 + "%";
        controlSocket.send("1 " + speed);
        lastKey = 87;
        break;
      }
    case 65: //A
      if(lastKey == 65) {
        break;
      } else {
        document.getElementById("controlFeedback").innerHTML = "Spin Left " + speed * 10 + "%";
        controlSocket.send("3 " + speed);
        lastKey = 65;
        break;
      }
    case 83: //S
      if(lastKey == 83) {
        break;
      } else {
        document.getElementById("controlFeedback").innerHTML = "Reverse " + speed * 10 + "%";
        controlSocket.send("2 " + speed);
        lastKey = 83;
        break;
      }
    case 68: //D
      if(lastKey == 68) {
        break;
      } else {
        document.getElementById("controlFeedback").innerHTML = "Spin Right " + speed * 10 + "%";
        controlSocket.send("4 " + speed);
        lastKey = 68
        break;
      }
  }
}

function onKeyUp(event) {
  var key = event.keyCode;
  switch (key) {
    case 87: //w
      document.getElementById("controlFeedback").innerHTML = "Stationary";
      controlSocket.send("1 0");
      lastKey = 0;
      break;
    case 65: //A
      document.getElementById("controlFeedback").innerHTML = "Stationary";
      controlSocket.send("3 0");
      lastKey = 0;
      break;
    case 83: //S
      document.getElementById("controlFeedback").innerHTML = "Stationary";
      controlSocket.send("2 0");
      lastKey = 0;      
      break;
    case 68: //D
      document.getElementById("controlFeedback").innerHTML = "Stationary";
      controlSocket.send("4 0");
      lastKey = 0;
      break;
  }
}