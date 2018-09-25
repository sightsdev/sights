#include <Wire.h>

void setup(){
  Serial.begin(9600);
  Wire.begin();
}

void loop ()
{
  getTemp(0x5A);
  getTemp(0x5B);
  getTemp(0x5C);

}

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
