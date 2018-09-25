#include "Adafruit_VL53L0X.h"
#define LOX_COUNT 3

Adafruit_VL53L0X lox[LOX_COUNT] = Adafruit_VL53L0X();
int lox_index;

bool setup_sensor(int pin, int addr) {
  // Initialize sensor with lox.begin(new_i2c_address) Pick any number but 0x29 and it must be under 0x7F. Going with 0x30 to 0x3F is probably OK.
  Serial.print("Setting up LOX at: ");
  Serial.println(addr);
  digitalWrite(pin, HIGH);
  if (lox[lox_index].begin(addr)) {
    Serial.println("LOX Setup Finished");
    lox_index++;
    return true;
  }
  else { 
    Serial.println("LOX Setup Failed");
    return false;
  }
}

<<<<<<< HEAD
void setup() {
  Serial.begin(115200);
  // wait until serial port opens for native USB devices
  while (! Serial) {
    delay(10);
    Serial.print(".");
  }

=======
void setup()
{
  Serial.begin(9600);
  Wire.begin();
  while (!Serial.available()) {
	Serial.println("Ready");
delay(500);
}
>>>>>>> master
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

  setup_sensor(4, 0x30);
  setup_sensor(5, 0x31);
  setup_sensor(6, 0x32);

<<<<<<< HEAD
=======
  vl53[0].init();
  Serial.println("inited");
  vl53[0].setAddress(0x32);
  vl53[0].setTimeout(500);
  vl53[0].startContinuous();

  /*digitalWrite(7, HIGH);
  
  vl53[1].init();
  vl53[1].setAddress(0x31);
  vl53[1].setTimeout(500);
  vl53[1].startContinuous();*/
>>>>>>> master
}


void loop() {
  for (int i = 0; i < LOX_COUNT; i++) {
    VL53L0X_RangingMeasurementData_t measure;

    Serial.print(i);
      
    lox[i].rangingTest(&measure, false); // pass in 'true' to get debug data printout!
  
    if (measure.RangeStatus != 4) {  // phase failures have incorrect data
      Serial.print(": "); Serial.println(measure.RangeMilliMeter);
    } else {
      Serial.println(": -");
    }

  }
  delay(100);
}
