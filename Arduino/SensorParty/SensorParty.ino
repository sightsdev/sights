#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <Adafruit_AMG88xx.h>
//#include "Adafruit_SGP30.h"
#include "Adafruit_VL53L0X.h"
//#include "Adafruit_VL6180X.h"
#include "VL6180X.h"

// Temperature Sensors
Adafruit_MLX90614 mlx[3];

// Distance Sensors
Adafruit_VL53L0X lox[2];
// Front VL53L0X to digital pin 4
// Back VL53L0X to digital pin 7
//Adafruit_VL6180X vl61[2];
VL6180X vl61[2];
// Left VL6180X to digital pin 5
// Right VL6180X to digital pin 6

// Thermal Camera
Adafruit_AMG88xx amg;

// CO2 Sensor
//Adafruit_SGP30 sgp;

float amg_pixels[AMG88xx_PIXEL_ARRAY_SIZE];

long AMGInterval = 330;
long SGPInterval = 1000;
long MLXInterval = 330;
long LOXInterval = 330;

long AMGLastRead = 0;
long SGPLastRead = 0;
long MLXLastRead = 0;
long LOXLastRead = 0;

bool AMGAvailable;
bool SGPAvailable;
bool MLXAvailable[3];
bool VL53Available[2];
bool VL61Available[2];

void setup() {
	Serial.begin(9600);
	while(!Serial.available()) {
		Serial.println("Waiting for input");
		delay (500);
	}
	Serial.println("Setup");
	
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

  delay(100);

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

  digitalWrite(4, HIGH);
  
	// But keep sensor #1 awake by keeping XSHUT pin high
	// Initialize sensor #1 with lox.begin(new_i2c_address) Pick any number but 0x29 and it must be under 0x7F. Going with 0x30 to 0x3F is probably OK.
  Serial.println("Setting up LOX 1");
  if (lox[0].begin(0x30)) {
    Serial.println("LOX 1 Setup Finished");
  }
  else { 
    Serial.println("LOX 1 Setup Failed");
  }

  digitalWrite(7, HIGH);
  
  Serial.println("Setting up LOX 2");
  if (lox[1].begin(0x31)) {
    Serial.println("LOX 2 Setup Finished");
  }
  else { 
    Serial.println("LOX 2 Setup Failed");
  }
	/*
	// Rinse and repeat
	Serial.println("Setting up left distance (VL6180X)");
	digitalWrite(5, HIGH);
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
*/
  
	/*if (vl61[0].begin(0x32)) {
		VL61Available[0] = true;
		Serial.println("Left distance setup finished");
	} else { 
		Serial.println("Left distance setup failed");
	}*/
	/*
	// Rinse and repeat
	Serial.println("Setting up right distance (VL6180X)");
	digitalWrite(6, HIGH);
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
  */
	/*if (vl61[1].begin(0x33)) {
		VL61Available[1] = true;
		Serial.println("Right distance setup finished");
	} else { 
		Serial.println("Right distance setup failed");
	}*/
 
	// Check if Gas Sensor (SGP) is ready
	/*Serial.println("Setting up SGP Sensor");
	if (sgp.begin()) {
		Serial.println("SGP Sensor found!");
		SGPAvailable = true;
	} else {
		Serial.println("SGP Sensor not found");
		SGPAvailable = false;
	}*/
	
	// Check if MLX Sensors are ready
	/*Serial.println("Setting up MLX Sensors");
  mlx[0] = Adafruit_MLX90614(0x5A);
  mlx[1] = Adafruit_MLX90614(0x5B);
  mlx[2] = Adafruit_MLX90614(0x5C);
	for (int i = 0; i < 2; i++) {
		if (! mlx[i].begin()) {
			Serial.print("MLX Sensor ");
			Serial.print(i);
			Serial.print(" not found");
			MLXAvailable[i] = false;
		} else {
			Serial.print("MLX Sensor ");
			Serial.print(i);
			Serial.print(" found");
			MLXAvailable[i] = true;
		}
	}*/

  // Check if Thermal Camera (AMG) is ready
  /*Serial.println("Setting up AMG Sensor");
  if (amg.begin()) {
    Serial.println("AMG88xx Sensor found!");
    AMGAvailable = true;
  } else {
    Serial.println("AMG88xx Sensor not found");
    AMGAvailable = false;
  }*/

  //!@%#^&(@!&*#%!@#)
  AMGAvailable = false;
  
	Serial.println("End Setup");
	delay(100); // let sensors boot up
}

int counter = 0;
void loop() {
	long currentTime = millis();
	
	// MLX TEMP SENSOR
	/*if (currentTime - MLXLastRead > MLXInterval) {
    MLXLastRead = millis();
		for (int i = 0; i < 2; i++) {
			if (MLXAvailable[i]) {
				Serial.print("MLX"); 
				Serial.print(i);
				Serial.print(" - Ambient ");
				Serial.print(mlx[i].readAmbientTempC()); 
				Serial.print("*C, Object ");
				Serial.print(mlx[i].readObjectTempC());
				Serial.println("*C");
			} else {
				Serial.print("MLX"); 
				Serial.print(i);
				Serial.println("Not Available");
			}
		}
	}*/
	
	// SGP GAS SENSOR
	/*if (SGPAvailable) {
		if(currentTime - SGPLastRead > SGPInterval){
			SGPLastRead = millis();
			if (! sgp.IAQmeasure()) {
				Serial.println("Measurement failed");
				return;
			}
			Serial.print("SGP -"); 
			// Total Volatile Organic Compound
			Serial.print("TVOC "); 
			Serial.print(sgp.TVOC); 
			Serial.print(" ppb\n");
			// CO2 Estimate
			Serial.print("eCO2 "); 
			Serial.print(sgp.eCO2); 
			Serial.println(" ppm");
			
			counter++;
			if (counter == 30) {
				counter = 0;
			
				uint16_t TVOC_base, eCO2_base;
				if (! sgp.getIAQBaseline(&eCO2_base, &TVOC_base)) {
					Serial.println("Failed to get baseline readings");
					return;
				}
				Serial.print("****Baseline values: eCO2: 0x"); 
				Serial.print(eCO2_base, HEX);
				Serial.print(" & TVOC: 0x"); 
				Serial.println(TVOC_base, HEX);
			}
		}
	}*/
  
	// AMG THERMAL CAMERA
	/*if (AMGAvailable) {
		if(currentTime - AMGLastRead > AMGInterval){
			AMGLastRead = millis();
			amg.readPixels(amg_pixels);
			Serial.print("[");
			for(int i=1; i<=AMG88xx_PIXEL_ARRAY_SIZE; i++){
				Serial.print(amg_pixels[i-1]);
				Serial.print(", ");
				if( i%8 == 0 ) Serial.println();
			}
			Serial.println("]");
		}
	}*/
	
	// LOX DISTANCE SENSORS
	//if (currentTime - LOXLastRead > LOXInterval) {
    //LOXLastRead = millis();
    // V53L0X first
    for (int i = 0; i < 2; i++) {
		  VL53L0X_RangingMeasurementData_t measure;
			lox[i].rangingTest(&measure, false); // pass in 'true' to get debug data printout!
			Serial.print("vl53 ");
			Serial.print(i);
			Serial.print(": ");	
			if (measure.RangeStatus != 4 && measure.RangeMilliMeter < 1200) {  // phase failures have incorrect data
				Serial.println(measure.RangeMilliMeter);
			} else {
				Serial.println("-");
			}
    }
   // VL6180X next
   /*for (int i = 0; i < 2; i++) {
      //uint8_t range = vl61[i].readRange();
      //uint8_t status = vl61[i].readRangeStatus();

      Serial.print("vl61 ");
      Serial.print(i);
      Serial.print(": "); 

      Serial.print(vl61[i].readRangeContinuousMillimeters());
      if (vl61[i].timeoutOccurred()) { Serial.print("TIMEOUT"); }
      if (status == VL6180X_ERROR_NONE) {
        Serial.print("Range: "); 
        if (range != 255) {
          Serial.println(range);
        } else {
          Serial.println("-");
        }
      }
    }*/
	//}
	delay(100);
	Serial.println();
}
