#include <Wire.h>
#include "Adafruit_VL6180X.h"
#include "Adafruit_VL53L0X.h"

Adafruit_VL53L0X vl53 = Adafruit_VL53L0X();
Adafruit_VL6180X vl61 = Adafruit_VL6180X();

void setup() {
  Serial.begin(115200);

  // wait for serial port to open on native usb devices
  while (!Serial.available()) {
    delay(500);
  }

  // Setup digital pins wired to LOX SHUTDOWN PIN
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  
  // Reset all sensors by setting all of their XSHUT pins low for delay(10)
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  delay(10);
  
  // Then set all XSHUT high to bring out of reset
  digitalWrite(4, HIGH);
  digitalWrite(5, HIGH);
  
  // Put all other sensors into shutdown by pulling XSHUT pins low
  digitalWrite(5, LOW);
  
  // But keep sensor #1 awake by keeping XSHUT pin high
  // Initialize sensor #1 with lox.begin(new_i2c_address) Pick any number but 0x29 and it must be under 0x7F. Going with 0x30 to 0x3F is probably OK.
  Serial.println("Setting up LOX 1");
  digitalWrite(4, HIGH);
  Serial.println("LOX 1 On");
  if (vl53.begin(0x30)) {
    //LOXAvailable[0] = true;
    Serial.println("LOX 1 Setup Finished");
  }
  else { 
    Serial.println("LOX 2 Setup Failed");
  }
  
  // Keep sensor #1 awake (now that it has a new addr), and now bring sensor #2 out of reset by setting its XSHUT pin high.
  // Initialize sensor #2 with lox.begin(new_i2c_address)
  Serial.println("Setting up LOX 2");
  digitalWrite(5, HIGH);
  Serial.println("LOX 2 On");
  if (vl61.begin(0x31)) {
    //LOXAvailable[1] = true;
    Serial.println("LOX 2 Setup Finished");
  }
  else { 
    Serial.println("LOX 2 Setup Failed");
  }
  
}

void loop() {
  VL53L0X_RangingMeasurementData_t measure;
  Serial.print("Reading a measurement... ");
  vl53.rangingTest(&measure, false); // pass in 'true' to get debug data printout!
  if (measure.RangeStatus != 4) {  // phase failures have incorrect data
    Serial.print("vl53: "); Serial.println(measure.RangeMilliMeter);
  } else {
    Serial.println(" out of range ");
  }
  
  uint8_t range = vl61.readRange();
  uint8_t status = vl61.readRangeStatus();
  //if (status == VL6180X_ERROR_NONE) {
    Serial.print("vl61: "); Serial.println(range);
  //}
  
  delay(150);
}
