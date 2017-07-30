import cv2
import numpy as np
from matplotlib import pyplot as plt
import pyqrcode
from pyzbar.pyzbar import decode
import imutils

def getNumber(line, prop):
	numbers = []
	count = 0
	found_equal = False
	if prop in line:
		for character in line:
			if found_equal == True:
				numbers.append(line[count])
			if character == '=':
				found_equal = True
			count = count + 1
		return numbers




 
cap = cv2.VideoCapture('http://10.0.2.3:8081/')




while(1):
	_, frame = cap.read()
	 
	im = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	bilateral_filtered_image = cv2.bilateralFilter(im, 5, 175, 175)
	edge_detected_image = cv2.Canny(bilateral_filtered_image, 75, 200)
	_, contours, _= cv2.findContours(edge_detected_image, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

	contour_list = []
	for contour in contours:
		approx = cv2.approxPolyDP(contour,0.01*cv2.arcLength(contour,True),True)
		if (len(approx) == 4):
			contour_list.append(contour)


	font = cv2.FONT_HERSHEY_SIMPLEX
	count = 1
	for contour in contour_list:
		x,y,w,h = cv2.boundingRect(contour)
	#cv2.rectangle(image,(x,y),(x+w,y+h),(0,255,0),2)
	#cv2.putText(image, str(count),(int(x),int(y)),font , 1, (200,255,155), 2, cv2.LINE_AA)
		print(count)
		count = count + 1

	cv2.drawContours(im, contour_list,  -1, (255,0,0), 3)

	#cv2.rectangle(img, (x1, y1), (x2, y2), (255,0,0), 2)
	
#cv2.drawContours(image, contour_list,  -1, (255,0,0), 2)
	cv2.imshow('Objects Detected',im)
	
	# Show keypoints
	cv2.imshow("Keypoints", im_with_keypoints)
	k = cv2.waitKey(5) & 0xFF
	if k == 27:
		break

	

