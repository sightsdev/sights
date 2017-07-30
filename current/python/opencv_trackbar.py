import cv2
import numpy as np


def nothing(x):
    pass

cap = cv2.VideoCapture(0)

# Create a black image, a window
img = np.zeros((300,512,3), np.uint8)
cv2.namedWindow('image')

# create trackbars for color change
cv2.createTrackbar('minR','image',0,255,nothing)
cv2.createTrackbar('minG','image',0,255,nothing)
cv2.createTrackbar('minB','image',0,255,nothing)
cv2.createTrackbar('maxR','image',0,255,nothing)
cv2.createTrackbar('maxG','image',0,255,nothing)
cv2.createTrackbar('maxB','image',0,255,nothing)


# create switch for ON/OFF functionality
switch = '0 : OFF \n1 : ON'
cv2.createTrackbar(switch, 'image',0,1,nothing)

while(1):

	frame = cap.read()
	
	hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

	# get current positions of four trackbars
	lr = cv2.getTrackbarPos('minR','image')
	lg = cv2.getTrackbarPos('minG','image')
	lb = cv2.getTrackbarPos('minB','image')
	ur = cv2.getTrackbarPos('maxR','image')
	ug = cv2.getTrackbarPos('maxG','image')
	ub = cv2.getTrackbarPos('maxB','image')
	s = cv2.getTrackbarPos(switch,'image')

	lower_red = np.array([0,0,0])
	upper_red = np.array([255,255,255])

	mask = cv2.inRange(HSV, lower_red, upper_red)
	res = cv2.bitwise_and(frame,frame, mask= mask)



	if s == 0:
		img[:] = 0
	else:
		img[:] = [b,g,r]
		
	cv2.imshow('image',img)
	cv2.imshow('frame',frame)
	cv2.imshow('mask',mask)
	cv2.imshow('res',res)

	k = cv2.waitKey(1) & 0xFF
	if k == 27:
		break


cv2.destroyAllWindows()
cap.release()
