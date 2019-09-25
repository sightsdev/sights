import serial
import time

def drive_motor(port, motor, speed, forward):
	val = (192 if motor==2 else 64)+round(63/100*max(min(speed, 100), 0))*(1 if forward else -1)
	print(val)
	port.write(bytes([val]))

def stop_motors(port):
	port.write(bytes([0]))

ser = serial.Serial(port='/dev/ttyAMA0', baudrate=9600, )
drive_motor(ser, 1, 100, True)
drive_motor(ser, 2, 100, True)
time.sleep(2)
drive_motor(ser, 1, 50, True)
drive_motor(ser, 2, 50, True)
time.sleep(5)
drive_motor(ser, 1, 100, False)
drive_motor(ser, 2, 100, False)
time.sleep(2)
drive_motor(ser, 1, 50, False)
drive_motor(ser, 2, 50, False)
time.sleep(5)
stop_motors(ser)


