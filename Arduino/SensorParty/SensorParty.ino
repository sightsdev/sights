#include <Wire.h>
#include "Adafruit_VL53L0X.h"
#include "Adafruit_SGP30.h"
#include "Adafruit_AMG88xx.h"
#define LOX_COUNT 4

// Adafruit VL53L0X Distance Sensor
Adafruit_VL53L0X lox[LOX_COUNT] = Adafruit_VL53L0X();
int lox_index;
// Adafruit SGP30 eC02 / TVOC Sensor
Adafruit_SGP30 sgp;
bool sgp_available;
// Adafruit AMG8833
Adafruit_AMG88xx amg;
float amg_pixels[AMG88xx_PIXEL_ARRAY_SIZE];
bool amg_available;

bool setup_lox(int pin, int addr) {
  // Initialize sensor with lox.begin(new_i2c_address) Pick any number but 0x29 and it must be under 0x7F. Going with 0x30 to 0x3F is probably OK.
  digitalWrite(pin, HIGH);
  delay(20);
  if (lox[lox_index].begin(addr)) {
    lox_index++;
    return true;
  }
  else { 
    return false;
  }
}

void setup() {
  Serial.begin(115200);
  // wait until serial port opens for native USB devices
  while (!Serial) {
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

  setup_lox(4, 0x30);
  setup_lox(5, 0x31);
  setup_lox(6, 0x32);
  setup_lox(7, 0x33);
  
  // SGP30
  if (sgp.begin()){
    sgp_available = true;
  }
  // AMG8833
  if (amg.begin()){
    amg_available = true;
  }
}


void loop() {
	// VL53l0X
	if (LOX_COUNT > 0) {
		Serial.print("D:");
		for (int i = 0; i < LOX_COUNT; i++) {
			VL53L0X_RangingMeasurementData_t measure;

			lox[i].rangingTest(&measure, false); // pass in 'true' to get debug data printout!
			int value = measure.RangeMilliMeter;

			if (measure.RangeStatus != 4 && value < 1250) {  // phase failures have incorrect data, and max range is around 1250
				Serial.print(value);
			} else {
				Serial.print("1250");
			}
			Serial.print(",");
		}
		Serial.println();
		delay(100);
    }
	// SGP30
	if (sgp_available) {
		Serial.print("G:");
		if (!sgp.IAQmeasure()) {
			Serial.println("0,0");
			return;
		}
		Serial.print(sgp.eCO2);
		Serial.print(",");
		Serial.print(sgp.TVOC);
		
		Serial.println();
		delay(100);
	}
	// AMG8833
	if (amg_available) {
		amg.readPixels(pixels);
		Serial.print("C:[");
		for(int i=1; i<=AMG88xx_PIXEL_ARRAY_SIZE; i++){
		  Serial.print(pixels[i-1]);
		  Serial.print(", ");
		  //if( i%8 == 0 ) Serial.println();
		}
		Serial.print("]");
		Serial.println();
	}
}
