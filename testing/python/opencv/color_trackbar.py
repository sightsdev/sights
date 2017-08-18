import cv2
import numpy as np

cap = cv2.VideoCapture(0)

# Create a black image, a window
#img = np.zeros((300,512,3), np.uint8)
#cv2.namedWindow('image')
def nothing(x):
    pass

img = np.zeros((300,512,3), np.uint8)
cv2.namedWindow('image')

# create trackbars for color change
cv2.createTrackbar('minH','image',0,255,nothing)
cv2.createTrackbar('minS','image',0,255,nothing)
cv2.createTrackbar('minV','image',0,255,nothing)
cv2.createTrackbar('maxH','image',0,255,nothing)
cv2.createTrackbar('maxS','image',0,255,nothing)
cv2.createTrackbar('maxV','image',0,255,nothing)
cv2.setTrackbarPos('maxH','image',255)
cv2.setTrackbarPos('maxS','image',255)
cv2.setTrackbarPos('maxV','image',255)

while(1):
	_, frame = cap.read()
	hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
	
	gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)


	# get current positions of four trackbars
	lh = cv2.getTrackbarPos('minH','image')
	ls = cv2.getTrackbarPos('minS','image')
	lv = cv2.getTrackbarPos('minV','image')
	uh = cv2.getTrackbarPos('maxH','image')
	us = cv2.getTrackbarPos('maxS','image')
	uv = cv2.getTrackbarPos('maxV','image')
	 
	lower_hsv = np.array([lh,ls,lv])
	upper_hsv = np.array([uh,us,uv])

	mask = cv2.inRange(hsv, lower_hsv, upper_hsv)
	res = cv2.bitwise_and(frame,frame, mask= mask)



	k = cv2.waitKey(5) & 0xFF
	if k == 27:
		break
		
	
	cv2.imshow('image',res)
	#cv2.imshow('frame',frame)
	#cv2.imshow('mask',mask)
	#cv2.imshow('res',res)


cv2.destroyAllWindows()
cap.release()
