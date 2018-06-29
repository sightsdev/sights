#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <Adafruit_AMG88xx.h>
#include <Adafruit_SGP30.h>
#include <VL6180X.h>
#include <VL53L0X.h>

// Thermal Camera
Adafruit_AMG88xx amg;

// CO2 Sensor
Adafruit_SGP30 sgp;

// Distance Sensors
VL6180X vl61[2];
VL53L0X vl53[2];

bool VL61Available[2];
bool VL53Available[2];
bool AMGAvailable;
bool SGPAvailable;

float amg_pixels[AMG88xx_PIXEL_ARRAY_SIZE];

void getTemp(int slave){
  Wire.beginTransmission(slave);  

  byte dataLow = 0x00;
  byte dataHigh = 0x00;

  delay(10);

  Wire.write(0x07);    // This is the command to view object temperature in the sensor's RAM
  delay(10);

  Wire.endTransmission(false);
  delay(10);

  Wire.requestFrom(slave, 2);
  delay(10);

  while (Wire.available()){
    dataLow = Wire.read();
    dataHigh = Wire.read();
  }
  delay(10);

  double tempFactor = 0.02; // 0.02 degrees per LSB (measurement resolution of the MLX90614)
  double tempData = 0x0000; // zero out the data

  // This masks off the error bit of the high byte, then moves it left 8 bits and adds the low byte.
  tempData = (double)(((dataHigh & 0x007F) << 8) + dataLow);
  tempData = (tempData * tempFactor)-0.01;

  float celcius = tempData - 273.15;
  Serial.print("Sensor 0x");
  Serial.print(slave, HEX);
  Serial.print(": ");
  Serial.print((String) celcius);
  Serial.println("C");
  
  Wire.endTransmission();

  delay(100);
}

void setup()
{
  Serial.begin(9600);
  Wire.begin();
 
  while(!Serial.available()) {
	Serial.println("Waiting for input");
	delay(500);
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
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  //digitalWrite(7, LOW);

  Serial.println("Setting up VL53L0X");
  //digitalWrite(7, HIGH);

  vl53[0].init();
  vl53[0].setAddress(0x34);
  vl53[0].setTimeout(500);
  vl53[0].startContinuous();

  Serial.println("Setting up second VL53L0X");
  digitalWrite(4, HIGH);

  vl53[1].init();
  vl53[1].setAddress(0x35);
  vl53[1].setTimeout(500);
  vl53[1].startContinuous();

  digitalWrite(6, HIGH);

  Serial.println("Setting up left distance (VL6180X)");
  vl61[0].init();
  vl61[0].configureDefault();
  vl61[0].setAddress(0x32);
  vl61[0].writeReg(VL6180X::SYSRANGE__MAX_CONVERGENCE_TIME, 30);
  vl61[0].writeReg16Bit(VL6180X::SYSALS__INTEGRATION_PERIOD, 50);
  vl61[0].setTimeout(500);
   // stop continuous mode if already active
  vl61[0].stopContinuous();
  // in case stopContinuous() triggered a single-shot
  // measurement, wait for it to complete
  delay(300);
  // start interleaved continuous mode with period of 100 ms
  vl61[0].startInterleavedContinuous(100);
  VL61Available[0] = true;
  
  digitalWrite(5, HIGH);

  Serial.println("Setting up right distance (VL6180X)");
  vl61[1].init();
  vl61[1].configureDefault();
  vl61[1].setAddress(0x33);
  vl61[1].writeReg(VL6180X::SYSRANGE__MAX_CONVERGENCE_TIME, 30);
  vl61[1].writeReg16Bit(VL6180X::SYSALS__INTEGRATION_PERIOD, 50);
  vl61[1].setTimeout(500);
   // stop continuous mode if already active
  vl61[1].stopContinuous();
  // in case stopContinuous() triggered a single-shot
  // measurement, wait for it to complete
  delay(300);
  // start interleaved continuous mode with period of 100 ms
  vl61[1].startInterleavedContinuous(100);
  VL61Available[1] = true;

  // AMG Setup
  /*Serial.print("AMG Sensor: ");
  if (amg.begin()) {
    Serial.println("found!");
    AMGAvailable = true;
  } else {
    Serial.println("not found");
    AMGAvailable = false;
  }*/

  /*// SGP Setup
  Serial.print("SGP Sensor: ");
  if (sgp.begin()) {
    Serial.println("found!");
    SGPAvailable = true;
  } else {
    Serial.println("not found");
    SGPAvailable = false;
  }*/
}

void loop()
{
  Serial.print("1: ");
  Serial.print(vl61[0].readRangeContinuousMillimeters());
  if (vl61[0].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  Serial.print("\t2: ");
  Serial.print(vl61[1].readRangeContinuousMillimeters());
  if (vl61[1].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  Serial.print("\t3: ");
  Serial.print(vl53[0].readRangeContinuousMillimeters());
  if (vl53[0].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  //Serial.print("\t4: ");
  //Serial.print(vl53[1].readRangeContinuousMillimeters());
  //if (vl53[1].timeoutOccurred()) { Serial.print(" TIMEOUT"); }
      
  Serial.println();

  delay(50);

  /*amg.readPixels(amg_pixels);
  Serial.print("[");
  for(int i=1; i<=AMG88xx_PIXEL_ARRAY_SIZE; i++){
    Serial.print(amg_pixels[i-1]);
    Serial.print(", ");
    if( i%8 == 0 ) Serial.println();
  }
  Serial.println("]");

  if (SGPAvailable) {
      if (! sgp.IAQmeasure()) {
        Serial.println("Measurement failed");
        return;
      }
      Serial.print("SGP - "); 
      // Total Volatile Organic Compound
      Serial.print("TVOC "); 
      Serial.print(sgp.TVOC); 
      Serial.print(" ppb");
      // CO2 Estimate
      Serial.print("\teCO2 "); 
      Serial.print(sgp.eCO2); 
      Serial.println(" ppm");
  }
  delay(50);

  getTemp(0x5A);
*/
  delay(100);
}
