import cv2
import numpy as np
from matplotlib import pyplot as plt
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
			if character == 'b':
				found_equal = True
			if character == "'" and line[count + 1] == ",":
				return numbers
			count = count + 1
		return numbers

def dataArrayToString(line, prop):
	number_string = ""
	number = getNumber(line, prop)
	if number == None:
		return "Nothing yet :/"
	for num in number:
		number_string = number_string + num
	return number_string


cap = cv2.VideoCapture('http://10.0.2.3:8081/')

while(1):
	_, im = cap.read()
	
	im = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
	
	#increase contrast
	contrast_image = cv2.equalizeHist(im)
	
	decoded = str(decode(contrast_image))
	font = cv2.FONT_HERSHEY_SIMPLEX
	cv2.putText(contrast_image, dataArrayToString(decoded, "data="), (50 ,60) ,font , 1, (200,255,155), 2, cv2.LINE_AA)
	print(decoded)
	print(dataArrayToString(decoded, "data="))
	
	# 2 at the same time?
	decoded2 = str(decode(im))
	font = cv2.FONT_HERSHEY_SIMPLEX
	cv2.putText(im, dataArrayToString(decoded2, "data="), (50 ,60) ,font , 1, (200,255,155), 2, cv2.LINE_AA)
	print(decoded2)
	print(dataArrayToString(decoded2, "data="))
	
	 
	
	cv2.imshow("Keypoints", im)
	cv2.imshow("Contrasted (Equalize Histogram)", contrast_image)
	k = cv2.waitKey(5) & 0xFF
	if k == 27:
		break


