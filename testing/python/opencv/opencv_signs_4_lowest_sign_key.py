import cv2
import numpy as np
from matplotlib import pyplot as plt
from operator import itemgetter 

class Sign(object): 
	
	def __init__(self, image, name, short, minHue, minSat, minBr, maxHue, maxSat, maxBr):
		self.name = name
		self.short = short
		self.image = image
		self.minHue = minHue
		self.minSat = minSat
		self.minBr = minBr
		self.maxHue = maxHue
		self.maxSat = maxSat
		self.maxBr = maxBr


img3 = cv2.imread('signs.png')
sign_list = []
		
sign_list.append(Sign("templates/template1.png", "Oxidizer", "Ox", 0, 100, 200, 255, 255, 255))#1
sign_list.append(Sign("templates/template2.png", "Organic Peroxide", "OP", 0, 100, 200, 255, 255, 255))#2
sign_list.append(Sign("templates/template3.png", "Flammable Liquid", "FL", 0, 100, 200, 255, 255, 255))#3
sign_list.append(Sign("templates/template4.png", "Inhalation Hazard", "IN", 0, 0, 0, 255, 10, 255))	 #4
sign_list.append(Sign("templates/template5.png", "Dangerous When Wet", "DWW", 80, 0, 0, 155, 255, 255))#5
sign_list.append(Sign("templates/template6.png", "Flammable Solid", "FS", 0, 0, 0, 255, 255, 255))#6
sign_list.append(Sign("templates/template7.png", "Spontaneously Combustible", "SP", 0, 0, 200, 255, 255, 255))#7
sign_list.append(Sign("templates/template8.png", "Explosives", "Ex", 0, 100, 200, 255, 255, 255))#8
sign_list.append(Sign("templates/template9.png", "Radioactive II", "Rad", 0, 100, 200, 255, 255, 255))#9
sign_list.append(Sign("templates/template10.png", "Corrosive", "Cor", 0, 0, 0, 255, 255, 255))#10
sign_list.append(Sign("templates/template11.png", "Non-flammable Gas", "NFG", 0, 0, 0, 255, 255, 255))#11
sign_list.append(Sign("templates/template12.png", "Infectious Substance", "IS", 0, 0, 0, 255, 10, 255))#12



def match(sign, rotate, debug=False):
	global img3
	
	check_image = cv2.imread('signs.png')
	hsv = cv2.cvtColor(check_image, cv2.COLOR_BGR2HSV)
	
	sign_image = cv2.imread(sign.image)
	
	mask = cv2.inRange(hsv, np.array([sign.minHue, sign.minSat, sign.minBr]), np.array([sign.maxHue, sign.maxSat, sign.maxBr]))
	res = cv2.bitwise_and(check_image,check_image, mask= mask)
	#No HSV
	res = check_image
	
	
	if (rotate == True):
		num_rows, num_cols = res.shape[:2]
		rotation_matrix = cv2.getRotationMatrix2D((num_cols/2, num_rows/2), 90, 1)
		res = cv2.warpAffine(res, rotation_matrix, (num_cols, num_rows))

	orb = cv2.ORB_create()
	kp1, des1 = orb.detectAndCompute(res,None)
	kp2, des2 = orb.detectAndCompute(sign_image,None)

	bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

	matches = bf.match(des1,des2)
	matches = sorted(matches, key = lambda x:x.distance)

	#img3 = cv2.drawMatches(res,kp1,img2,kp2,matches[:1],None, flags=2)

	img1_kp1 = matches[0].queryIdx
	(x1, y1) = kp1[img1_kp1].pt
	#print((int(x1), int(y1)))
	#print (matches[0].distance)
	if(matches[0].distance < 36):
		cv2.imshow("matches", cv2.imread(sign.image))

	
	img3 = cv2.circle(img3,(int(x1), int(y1)), 15, (255,0,0), 2)
	
	cv2.imshow("match", img3)
	
	if (debug):
		print(sign.name)
		cv2.imshow("res", res)
		cv2.imshow("template", cv2.imread(sign.image))
	
	
	
	return matches[0].distance
	

sign_distances = {}

for sign in sign_list:
	
	distance = match(sign, False)
	rotated_distance = match(sign, True)
	if (distance > rotated_distance):
		distance = rotated_distance
	sign_distances[sign] = distance

for sign, distance in sorted(sign_distances.items(), key=itemgetter(1), reverse=False):
	print(sign.name + ": " + str(distance)) 
		
#match(sign_list[2], False, True)

 

#>>> for k, v in s:
#...     k, v


cv2.waitKey(0)
	
	


'''
Dictionary ( Sign >>> Distance )
Loop through all signs
	Match and store distance
	Rotate 180 and match again
	Store lowest distance

Sort dictionary by values (distance)
'''



	
		
