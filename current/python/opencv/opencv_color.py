import cv2
import numpy as np
from matplotlib import pyplot as plt

#img = cv2.imread('watch.jpg',cv2.IMREAD_GRAYSCALE)
img = cv2.imread('signs2.png',cv2.IMREAD_COLOR)
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

#img = cv2.imread('watch.jpg',cv2.IMREAD_COLOR)

#hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
#cv2.imshow('image',img)

lower_red = np.array([0,100, 200])
upper_red = np.array([255,255,255])

mask = cv2.inRange(hsv, lower_red, upper_red)
res = cv2.bitwise_and(img,img, mask= mask)

cv2.imshow('img',img)
cv2.imshow('hsv',img)
cv2.imshow('mask',mask)
cv2.imshow('res',res)


cv2.waitKey(0)

cv2.destroyAllWindows()
