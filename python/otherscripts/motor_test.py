from tkinter import *
from tkinter import ttk
from pyax12.connection import Connection
import time

#def onKeyPress(event):
 #   text.insert('end', 'You pressed %s\n' % (event.char, ))
  #  print("You pressed :" + event.character_data)
    

sc = Connection(port="/dev/ttyACM0", baudrate=1000000)

# How to change ID
#sc.write_data(1,3,(bytes(1))

#sc.read_data(1,3,1)
#sc.write_data(1,3,0x01)


speedSetting = 1
id = 1

# Control table stuff
#sc.pretty_print_control_table(id)

# Change mode (set angle limit to 0 according to doco at support robotis control table)
sc.write_data(1,8,bytes([0,0]))

# Set low and high bit of moving speed (high bit seems to change speed and direction) 
sc.write_data(1,32,bytes([0,0]))

# TK() is part of tkinter, Python's GUI
top = Tk()

# Function to convert an int from 0 to 2047 (2 x 1024 - 1), to two bytes
# NOTE: 1024 to 2047 is reverse mode (i.e. th 10th bit changes from 0 to 1)
# Downgraded, if we use speed setting instead
# INPUTS: num is 0 to 1023, reverse is True or False
def toByteArray(num, reverse):
	a = num;
	if reverse:
		a = a + 1024
	return bytearray(a.to_bytes(2, 'little'))
	
# Function 2.0, to just have 4 speed settings, making use of the global variable
# INPUTS: speedSetting (global) is 1 to 4, reverse is True or False
def speedSettingToByteArray(reverse):
	global speedSetting
	a = speedSetting * 256 - 1;
	if reverse:
		a = a + 1024
	return bytearray(a.to_bytes(2, 'little'))

# TK stuff, events that happen when you're pressing or releasing Go or Reverse buttons 
def goPress(event):
	print("Go was pressed")
	#b = toByteArray(1023, False)
	b = speedSettingToByteArray(False)
	sc.write_data(1,32,b)

def goRelease(event):
	sc.write_data(1,32,bytes([0,0]))
   
def reversePress(event):
	print("Go was pressed")
	#b = toByteArray(1023, True)
	b = speedSettingToByteArray(True)
	sc.write_data(1,32,b)
	
def reverseRelease(event):
	sc.write_data(1,32,bytes([0,0]))
	
	
# More TK stuff, increase/decrease speed	
def spUpPress():
	global speedSetting
	if speedSetting < 4:
		speedSetting = speedSetting + 1
		
def spDownPress():
	global speedSetting
	if speedSetting > 1:
		speedSetting = speedSetting - 1

# All the magic happens here, bind events (above functions) to buttons (two different ways to bind)
speedometer = Label(top, text=str(speedSetting))
speedometer.pack()

spUp = Button(top, text ="Speed Up", command=spUpPress)
spUp.pack()

spDown = Button(top, text ="Speed Down", command=spDownPress)
spDown.pack()


go = Button(top, text ="Go")
go.bind('<Button-1>', goPress)
go.bind('<ButtonRelease-1>', goRelease)
go.pack()
   
reverse = Button(top, text ="Reverse")
reverse.bind('<Button-1>', reversePress)
reverse.bind('<ButtonRelease-1>', reverseRelease)
reverse.pack()

# TK stuff to keep checking for events
top.mainloop()

# TO DO somewhere...update/refresh the label displaying the speed

# Close the connection to the USB2AX
sc.close()
