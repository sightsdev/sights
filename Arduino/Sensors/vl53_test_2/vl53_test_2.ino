#include "Adafruit_VL53L0X.h"

Adafruit_VL53L0X lox[2] = Adafruit_VL53L0X();

void setup() {
  Serial.begin(9600);
  // wait until serial port opens for native USB devices
  while (! Serial) {
    delay(10);
    Serial.print(".");
  }

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
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  digitalWrite(7, LOW);
  
  
  // But keep sensor #1 awake by keeping XSHUT pin high
  // Initialize sensor #1 with lox.begin(new_i2c_address) Pick any number but 0x29 and it must be under 0x7F. Going with 0x30 to 0x3F is probably OK.
  Serial.println("Setting up LOX 1");
  digitalWrite(4, HIGH);
  Serial.println("LOX 1 On");
  if (lox[0].begin(0x30)) {
    Serial.println("LOX 1 Setup Finished");
  }
  else { 
    Serial.println("LOX 1 Setup Failed");
  }

  Serial.println("Setting up LOX 2");
  digitalWrite(7, HIGH);
  Serial.println("LOX 2 On");
  if (lox[1].begin(0x31)) {
    Serial.println("LOX 2 Setup Finished");
  }
  else { 
    Serial.println("LOX 2 Setup Failed");
  }
  // power 
  Serial.println(F("VL53L0X API Simple Ranging example\n\n")); 
}


void loop() {
  for (int i = 0; i < 2; i++) {
    VL53L0X_RangingMeasurementData_t measure;

    Serial.print(i);
      
    //Serial.print("Reading a measurement... ");
    lox[i].rangingTest(&measure, false); // pass in 'true' to get debug data printout!
  
    if (measure.RangeStatus != 4) {  // phase failures have incorrect data
      Serial.print(": "); Serial.println(measure.RangeMilliMeter);
    } else {
      Serial.println(" out of range ");
    }

  }
  delay(100);
}
