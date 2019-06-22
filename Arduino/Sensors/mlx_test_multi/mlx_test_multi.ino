/*************************************************** 
  This is a library example for the MLX90614 Temp Sensor
  modified to use multiple sensors

  Designed specifically to work with the MLX90614 sensors in the
  adafruit shop
  ----> https://www.adafruit.com/products/1747 3V version
  ----> https://www.adafruit.com/products/1748 5V version

  These sensors use I2C to communicate, 2 pins are required to  
  interface
  Adafruit invests time and resources providing this open source code, 
  please support Adafruit and open-source hardware by purchasing 
  products from Adafruit!

  Written by Limor Fried/Ladyada for Adafruit Industries.  
  BSD license, all text above must be included in any redistribution
 ****************************************************/

#include <Wire.h>
#include <Adafruit_MLX90614.h>

Adafruit_MLX90614 mlxA = Adafruit_MLX90614(0x5A);
Adafruit_MLX90614 mlxB = Adafruit_MLX90614(0x5B);
Adafruit_MLX90614 mlxC = Adafruit_MLX90614(0x5C);

void setup() {
  Serial.begin(9600);

  Serial.println("Adafruit MLX90614 test");  

  mlxA.begin(); 
  mlxB.begin();  
  mlxC.begin(); 
}

void loop() {
  Serial.print("A:");Serial.print(mlxA.readObjectTempC()); Serial.print("*C\t");
  Serial.print("B:");Serial.print(mlxB.readObjectTempC()); Serial.print("*C\t");
  Serial.print("C:");Serial.print(mlxC.readObjectTempC()); Serial.println("*C");
  delay(100);
}
