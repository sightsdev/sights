import cv2
import numpy as np
from matplotlib import pyplot as plt

img1 = cv2.imread('signs.png')

img2 = cv2.imread('templates/template1.png')


hsv = cv2.cvtColor(img1, cv2.COLOR_BGR2HSV)

#img = cv2.imread('watch.jpg',cv2.IMREAD_COLOR)

#hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
#cv2.imshow('image',img)

lower_red = np.array([0,100, 200])
upper_red = np.array([255,255,255])

mask = cv2.inRange(hsv, lower_red, upper_red)
res = cv2.bitwise_and(img1,img1, mask= mask)

num_rows, num_cols = img1.shape[:2]

rotation_matrix = cv2.getRotationMatrix2D((num_cols/2, num_rows/2), 90, 1)
img1 = cv2.warpAffine(res, rotation_matrix, (num_cols, num_rows))


orb = cv2.ORB_create()
kp1, des1 = orb.detectAndCompute(res,None)
kp2, des2 = orb.detectAndCompute(img2,None)

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

matches = bf.match(des1,des2)
matches = sorted(matches, key = lambda x:x.distance)

#img3 = cv2.drawMatches(res,kp1,img2,kp2,matches[:1],None, flags=2)

img1_kp1 = matches[0].queryIdx
(x1, y1) = kp1[img1_kp1].pt
print((int(x1), int(y1)))
print (matches[0].distance)

img3 = cv2.circle(res,(int(x1), int(y1)), 15, (255,0,0), 2)

cv2.imshow("Masked", img3)
cv2.imshow("Template Found", img2)
plt.show()

cv2.imshow("img1", img1)

cv2.waitKey(0)

