#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <Adafruit_AMG88xx.h>
#include "Adafruit_SGP30.h"
#include "Adafruit_VL53L0X.h"

// Temperature Sensors
Adafruit_MLX90614 mlx[3];

// Distance Sensors
Adafruit_VL53L0X lox[4];

// Thermal Camera
Adafruit_AMG88xx amg;
// CO2 Sensor
Adafruit_SGP30 sgp;

float amg_pixels[AMG88xx_PIXEL_ARRAY_SIZE];

long AMGInterval = 330;
long SGPInterval = 1000;
long MLXInterval = 330;
long LOXInterval = 330;

long AMGLastRead = 0;
long SGPLastRead = 0;
long MLXLastRead = 0;
long LOXLastRead = 0;

bool AMGAvailable = true;
bool SGPAvailable = true;
bool MLXAvailable[3];
bool LOXAvailable[3];

void setup() {
	Serial.begin(9600);
	while(!Serial.available()) {
		Serial.println("Waiting for input");
		delay (500);
	}
	
	Serial.println("Setup");
	
	mlx[0] = Adafruit_MLX90614(0x5A);
	mlx[1] = Adafruit_MLX90614(0x5B);
	mlx[2] = Adafruit_MLX90614(0x5C);
	
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
		LOXAvailable[0] = true;
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
	if (lox[1].begin(0x31)) {
		LOXAvailable[1] = true;
		Serial.println("LOX 2 Setup Finished");
	}
	else { 
		Serial.println("LOX 2 Setup Failed");
	}
	
	// Rinse and repeat
	Serial.println("Setting up LOX 3");
	digitalWrite(6, HIGH);
	Serial.println("LOX 3 On");
	if (lox[2].begin(0x32)) {
		LOXAvailable[2] = true;
		Serial.println("LOX 3 Setup Finished");
	}
	else { 
		Serial.println("LOX 3 Setup Failed");
	}
	
	// Rinse and repeat
	Serial.println("Setting up LOX 4");
	digitalWrite(7, HIGH);
	Serial.println("LOX 4 On");
	if (lox[3].begin(0x33)) {
		LOXAvailable[3] = true;
		Serial.println("LOX 4 Setup Finished");
	}
	else { 
		Serial.println("LOX 4 Setup Failed");
	}
 
	// Check if Gas Sensor (SGP) is ready
	Serial.println("Setting up SGP Sensor");
	if (sgp.begin()) {
		Serial.println("SGP Sensor found!");
		SGPAvailable = true;
	} else {
		Serial.println("SGP Sensor not found");
		SGPAvailable = false;
	}

	// Check if Thermal Camera (AMG) is ready
	Serial.println("Setting up AMG Sensor");
	if (amg.begin()) {
		Serial.println("AMG88xx Sensor found!");
		AMGAvailable = true;
	} else {
		Serial.println("AMG88xx Sensor not found");
		AMGAvailable = false;
	}

	//!@%#^&(@!&*#%!@#)
	//AMGAvailable = false;
	
	// Check if MLX Sensors are ready
	Serial.println("Setting up MLX Sensors");
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
	}
	Serial.println("End Setup");
	delay(100); // let sensors boot up
}

int counter = 0;
void loop() {
	long currentTime = millis();
	
	// MLX TEMP SENSOR
	if (currentTime - MLXLastRead > MLXInterval) {
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
	}
	
	// SGP GAS SENSOR
	if (SGPAvailable) {
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
	} else {
		Serial.println("SGP is not available");
	}
  
	// AMG THERMAL CAMERA
	if (AMGAvailable) {
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
	} else {
		Serial.println("AMG is not available");
	}
	
	// LOX DISTANCE SENSORS
	if (currentTime - LOXLastRead > LOXInterval) {
		for (int i = 0; i < 4; i++) {
			VL53L0X_RangingMeasurementData_t measure;
			lox[i].rangingTest(&measure, false); // pass in 'true' to get debug data printout!
			Serial.print("LOX ");
			Serial.print(i);
			Serial.print(": ");	
			if (measure.RangeStatus != 4) {  // phase failures have incorrect data
				Serial.println(measure.RangeMilliMeter);
			} else {
				Serial.println("-");
			}
		}
	}
	
	Serial.println();
	delay(500);
}
