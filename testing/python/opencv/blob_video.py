# Standard imports
import cv2
import numpy as np;
 
 
cap = cv2.VideoCapture('http://10.0.2.3:8081/')

while(1):
	_, frame = cap.read()
	 
	im = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	 
	# Read image
	#im = cv2.imread("blob_detection.jpg", cv2.IMREAD_GRAYSCALE)
	 
	# Set up the detector with default parameters.
	detector = cv2.SimpleBlobDetector_create()
	 
	# Detect blobs.
	keypoints = detector.detect(im)
	 
	# Draw detected blobs as red circles.
	# cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS ensures the size of the circle corresponds to the size of blob
	im_with_keypoints = cv2.drawKeypoints(im, keypoints, np.array([]), (0,0,255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
	 
	# Show keypoints
	cv2.imshow("Keypoints", im_with_keypoints)
	k = cv2.waitKey(5) & 0xFF
	if k == 27:
		break
