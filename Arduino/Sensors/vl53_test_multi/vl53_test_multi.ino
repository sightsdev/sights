/* This example shows how to use continuous mode to take
range measurements with the VL53L0X. It is based on
vl53l0x_ContinuousRanging_Example.c from the VL53L0X API.

The range readings are in units of mm. */

#include <Wire.h>
#include <VL53L0X.h>

VL53L0X vl53[2];

void setup()
{
  Serial.begin(9600);
  Wire.begin();

  // Setup digital pins wired to LOX SHUTDOWN PIN
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  
  // Reset all sensors by setting all of their XSHUT pins low for delay(10)
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  digitalWrite(7, LOW);
  delay(10);
  
  // Then set all XSHUT high to bring out of reset
  digitalWrite(4, HIGH);
  digitalWrite(5, HIGH);
  digitalWrite(6, HIGH);
  digitalWrite(7, HIGH);
  
  // Put all other sensors into shutdown by pulling XSHUT pins low
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  digitalWrite(7, LOW);

  Serial.println("Start");

  digitalWrite(7, HIGH);

  vl53[0].init();
  vl53[0].setAddress(0x32);
  vl53[0].setTimeout(500);
  vl53[0].startContinuous();

  /*digitalWrite(7, HIGH);
  
  vl53[1].init();
  vl53[1].setAddress(0x31);
  vl53[1].setTimeout(500);
  vl53[1].startContinuous();*/
}

void loop()
{
  Serial.print(vl53[0].readRangeContinuousMillimeters());
  if (vl53[0].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  //Serial.print(vl53[1].readRangeContinuousMillimeters());
  //if (vl53[1].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  Serial.println();
}
