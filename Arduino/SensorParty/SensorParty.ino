#include <Wire.h>
#include "Adafruit_VL53L0X.h"
#include "Adafruit_SGP30.h"
#include "Adafruit_AMG88xx.h"
#include "Adafruit_MLX90614.h"
#define LOX_COUNT 4
#define MLX_COUNT 3

// Adafruit VL53L0X Distance Sensor
Adafruit_VL53L0X lox[LOX_COUNT] = Adafruit_VL53L0X();
int lox_index;
// Counter, to run every x iterations
int lox_counter;
int lox_rate = 5;

// Adafruit (or similar) MLX90614 Temperature Sensor
Adafruit_MLX90614 mlx[MLX_COUNT];
// Counter, to run every x iterations
int mlx_counter;
int mlx_rate = 7;

// Adafruit SGP30 eC02 / TVOC Sensor
Adafruit_SGP30 sgp;
bool sgp_available = false;
// Counter, to run every x iterations
int sgp_counter;
int sgp_rate = 7;

// Adafruit AMG8833
Adafruit_AMG88xx amg;
float amg_pixels[AMG88xx_PIXEL_ARRAY_SIZE];
bool amg_available = false;
// Counter, to run every x iterations
int amg_counter;
int amg_rate = 1; 


bool setup_lox(int pin, int addr) {
  // Initialize sensor with lox.begin(new_i2c_address) Pick any number but 0x29 and it must be under 0x7F. Going with 0x30 to 0x3F is probably OK.
  digitalWrite(pin, HIGH);
  delay(20);
  if (lox[lox_index].begin(addr)) {
    lox_index++;
    return true;
  } else { 
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

  // VL53l0X
  setup_lox(4, 0x30);
  setup_lox(5, 0x31);
  setup_lox(6, 0x32);
  setup_lox(7, 0x33);

  // MLX90614
  for (int i = 0; i < MLX_COUNT; i++) { 
    mlx[i] = Adafruit_MLX90614(0x5A + i);
    mlx[i].begin();
  }
  
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
  
  // MLX90614
  if (mlx_counter > mlx_rate) {
    if (MLX_COUNT > 0) {
      Serial.print("T:");
      for (int i = 0; i < MLX_COUNT; i++) {
        Serial.print(mlx[i].readObjectTempC());
        Serial.print(",");
      }
      Serial.println();
    }
    mlx_counter = 0;
  } else mlx_counter++;
  
	// VL53l0X
  if (lox_counter > lox_rate) {
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
    lox_counter = 0;
  } else lox_counter++;
    
	// SGP30
  if (sgp_counter > sgp_rate) {
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
   sgp_counter = 0;
  } else sgp_counter++;
 
	// AMG8833
  if (amg_counter > amg_rate) {
  	if (amg_available) {
  		amg.readPixels(amg_pixels);
  		Serial.print("C:");
  		for(int i=1; i<=AMG88xx_PIXEL_ARRAY_SIZE; i++){
  		  Serial.print(amg_pixels[i-1]);
  		  Serial.print(",");
  		  //if( i%8 == 0 ) Serial.println();
  		}
  		//Serial.print("]");
  		Serial.println();
  	}
     amg_counter = 0;
  } else amg_counter++;
}
