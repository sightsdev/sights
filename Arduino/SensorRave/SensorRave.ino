#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <Adafruit_AMG88xx.h>
#include <Adafruit_SGP30.h>

// Thermal Camera
Adafruit_AMG88xx amg;

// CO2 Sensor
Adafruit_SGP30 sgp;

// Temp
Adafruit_MLX90614 mlx;

bool MLXAvailable[3];
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

  mlx = Adafruit_MLX90614(0x5A);
  if (! mlx.begin()) {
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

  // SGP Setup
  Serial.print("SGP Sensor: ");
  if (sgp.begin()) {
    Serial.println("found!");
    SGPAvailable = true;
  } else {
    Serial.println("not found");
    SGPAvailable = false;
  }
}

void loop()
{
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

  Serial.print("MLX"); 
  Serial.print(i);
  Serial.print(" - Ambient ");
  Serial.print(mlx[i].readAmbientTempC()); 
  Serial.print("*C, Object ");
  Serial.print(mlx[i].readObjectTempC());
  Serial.println("*C");
 

  delay(100);
}
