import tkinter # note that module name has changed from Tkinter in Python 2 to tkinter in Python 3
import numpy as np
import cv2

cap = cv2.VideoCapture(0)
cv2.resize
 
while(True):
    ret, frame = cap.read()
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()




top = tkinter.Tk()
# Code to add widgets will go here...

top.geometry("500x500")

top.mainloop()


