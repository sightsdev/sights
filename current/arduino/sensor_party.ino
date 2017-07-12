#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_LSM303_U.h> // this is compass
#include <Adafruit_MLX90614.h> // this is temp
#include <SharpIR.h>

#define ir0 A0
#define ir1 A1
#define ir2 A2
#define ir3 A3
#define model 1080

Adafruit_LSM303_Mag_Unified mag = Adafruit_LSM303_Mag_Unified(12345);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
SharpIR sharp0 = SharpIR(ir0, model);
SharpIR sharp1 = SharpIR(ir1, model);
SharpIR sharp2 = SharpIR(ir2, model);
SharpIR sharp3 = SharpIR(ir3, model);


const float Pi = 3.14159;

void setup() {
   Serial.begin(9600);
   mag.enableAutoRange(true);
    if(!mag.begin())
  {
    /* There was a problem detecting the LSM303 ... check your connections */
    Serial.println("Ooops, no LSM303 detected ... Check your wiring!");
    while(1);
  }
  mlx.begin();

}

void loop() {
 sensors_event_t event;
  mag.getEvent(&event);
  

  float heading = (atan2(event.magnetic.y,event.magnetic.x) * 180) / Pi;
  // Normalize to 0-360
  if (heading < 0)
  {
    heading = 360 + heading;
  }
  Serial.print(heading); Serial.print("*\n");

  /* Display the results (magnetic vector values are in micro-Tesla (uT)) */

  /* Note: You can also get the raw (non unified values) for */
  /* the last data sample as follows. The .getEvent call populates */
  /* the raw values used below. */
  // Serial.print("X Raw: "); Serial.print(mag.raw.x); Serial.print("  ");
  // Serial.print("Y Raw: "); Serial.print(mag.raw.y); Serial.print("  ");
  // Serial.print("Z Raw: "); Serial.print(mag.raw.z); Serial.println("");

  // MLX
  //Serial.println("MLX temperature");
  Serial.print("Ambient = "); Serial.print(mlx.readAmbientTempC()); 
  Serial.print("*C\tObject = "); Serial.print(mlx.readObjectTempC()); Serial.println("*C");
  Serial.print("Ambient = "); Serial.print(mlx.readAmbientTempF()); 
  Serial.print("*F\tObject = "); Serial.print(mlx.readObjectTempF()); Serial.println("*F");

  Serial.println();

  unsigned long pepe1=millis();  // takes the time before the loop on the library begins

  int dis0=sharp0.distance();  // this returns the distance to the object you're measuring
  int dis1=sharp1.distance();
  int dis2=sharp2.distance();
  int dis3=sharp3.distance();


  Serial.print("Mean distance (IR0): ");  // returns it to the serial monitor
  Serial.println(dis0);

  Serial.print("Mean distance (IR1): ");  // returns it to the serial monitor
  Serial.println(dis1);

  Serial.print("Mean distance (IR2): ");  // returns it to the serial monitor
  Serial.println(dis2);

  Serial.print("Mean distance (IR3): ");  // returns it to the serial monitor
  Serial.println(dis3);
  /* Delay before the next sample */
  delay(500);

}
