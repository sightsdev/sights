#include <Wire.h>

#define LED_pin 13
#define slaveAddress 0x5A

void setup(){
  // An LED will blink to indicate when we have successfully read the temperature
  //pinMode(LED_pin, OUTPUT);
  Serial.begin(9600);
  //digitalWrite(LED_pin, LOW);
  Wire.begin();
  Wire.beginTransmission(slaveAddress);
}

void loop(){
  // Store the two relevant bytes of data for temperature
  byte dataLow = 0x00;
  byte dataHigh = 0x00;

  delay(10);

  Wire.write(0x07);    // This is the command to view object temperature in the sensor's RAM
  delay(10);

  Wire.endTransmission(false);
  delay(10);

  Wire.requestFrom(slaveAddress, 2);
  delay(10);

  while (Wire.available()){
    dataLow = Wire.read();
    dataHigh = Wire.read();
    //digitalWrite(LED_pin, HIGH);    // Blink the LED to indicate a successful reading
  }
  delay(10);
  //digitalWrite(LED_pin, LOW);

  double tempFactor = 0.02; // 0.02 degrees per LSB (measurement resolution of the MLX90614)
  double tempData = 0x0000; // zero out the data

  // This masks off the error bit of the high byte, then moves it left 8 bits and adds the low byte.
  tempData = (double)(((dataHigh & 0x007F) << 8) + dataLow);
  tempData = (tempData * tempFactor)-0.01;

  float celcius = tempData - 273.15;

  Serial.print((String) celcius);
  Serial.println("C");

delay(100);
}
