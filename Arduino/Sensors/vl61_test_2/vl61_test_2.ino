/* This example demonstrates how to use interleaved mode to
take continuous range and ambient light measurements. The
datasheet recommends using interleaved mode instead of
running "range and ALS continuous modes simultaneously (i.e.
asynchronously)".

In order to attain a faster update rate (10 Hz), the max
convergence time for ranging and integration time for
ambient light measurement are reduced from the normally
recommended defaults. See section 2.4.4 ("Continuous mode
limits") and Table 6 ("Interleaved mode limits (10 Hz
operation)") in the VL6180X datasheet for more details.

Raw ambient light readings can be converted to units of lux
using the equation in datasheet section 2.13.4 ("ALS count
to lux conversion").

Example: A VL6180X gives an ambient light reading of 613
with the default gain of 1 and an integration period of
50 ms as configured in this sketch (reduced from 100 ms as
set by configureDefault()). With the factory calibrated
resolution of 0.32 lux/count, the light level is therefore
(0.32 * 613 * 100) / (1 * 50) or 392 lux.

The range readings are in units of mm. */

#include <Wire.h>
#include <VL6180X.h>

VL6180X vl61[2];

bool VL61Available[2];

void setup()
{
  Serial.begin(9600);
  Wire.begin();

while (!Serial.available()){Serial.println("...");

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
  digitalWrite(7, LOW);

  
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

}

void loop()
{
  Serial.print("1: ");
  Serial.print(vl61[0].readRangeContinuousMillimeters());
  if (vl61[0].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  Serial.print("\t2: ");
  Serial.print(vl61[1].readRangeContinuousMillimeters());
  if (vl61[1].timeoutOccurred()) { Serial.print(" TIMEOUT"); }

  Serial.println();
}
