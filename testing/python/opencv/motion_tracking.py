# import the necessary packages
import argparse
import datetime
import imutils
import time
import cv2
import numpy as np

''' 
# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-v", "--video", help="path to the video file")
ap.add_argument("-a", "--min-area", type=int, default=500, help="minimum area size")
args = vars(ap.parse_args())
 
# if the video argument is None, then we are reading from webcam
if args.get("video", None) is None:
	camera = cv2.VideoCapture(0)
	time.sleep(0.25)
 
# otherwise, we are reading from a video file
else:

'''

def blob_detection(my_frame):
	im = cv2.cvtColor(my_frame, cv2.COLOR_BGR2GRAY)
	 
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
	cv2.imshow("Motion Detection", im_with_keypoints)


#video = "Man walks into a room.mp4"
video = "dot_tracking.mp4"
min_area = 50
min_thresh = 25
camera = cv2.VideoCapture('http://10.0.2.3:8081/')
if (not camera.isOpened()):
	camera = cv2.VideoCapture(video)
 
# initialize the first frame in the video stream
firstFrame = None

# loop over the frames of the video
while True:
	# grab the current frame and initialize the occupied/unoccupied
	# text
	(grabbed, frame) = camera.read()
	
	blob_detection(frame)
	
	text = "Unoccupied"
 
	# if the frame could not be grabbed, then we have reached the end
	# of the video
	if not grabbed:
		break
 
	# resize the frame, convert it to grayscale, and blur it
	frame = imutils.resize(frame, width=500)
	gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
	gray = cv2.GaussianBlur(gray, (21, 21), 0)
 
	# if the first frame is None, initialize it
	if firstFrame is None:
		firstFrame = gray
		continue

	# compute the absolute difference between the current frame and
	# first frame
	frameDelta = cv2.absdiff(firstFrame, gray)
	thresh = cv2.threshold(frameDelta, min_thresh, 255, cv2.THRESH_BINARY)[1]
 
	# dilate the thresholded image to fill in holes, then find contours
	# on thresholded image
	dilate = cv2.dilate(thresh, None, iterations=2)
	#(cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
	#cnts = cv2.findContours(dilate.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
	_, cnts, _= cv2.findContours(dilate.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
	
 
	for c in cnts:
		area = cv2.contourArea(c)
		print(area)
		
		if cv2.contourArea(c) < min_area:
			continue
 
		# compute the bounding box for the contour, draw it on the frame,
		# and update the text
		(x, y, w, h) = cv2.boundingRect(c)
		cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
		text = "Occupied"
		#cv2.boundingRect(c)
		#cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
		#text = "Occupied"
 
	cv2.imshow('frame',frame)
	#cv2.imshow('thresh',thresh)
	cv2.imshow('dilate',dilate)
 
	key = cv2.waitKey(1) & 0xFF
 
	# if the `q` key is pressed, break from the lop
	if key == ord("q"):
		break
	if key == 27:
		break
 
# cleanup the camera and close any open windows
camera.release()
cv2.destroyAllWindows()

