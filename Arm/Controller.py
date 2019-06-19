#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Fri May 31 15:27:27 2019

@author: sart
"""
import math

class DPad():
    Directions = {
            "up":0,
            "down":1,
            "left":2,
            "right":3,
            "released":-1
            }
    
    def __init__(self, msg_key):
        self.msg_key = msg_key
        self.direction = self.Directions["released"]
        
    def update(self, msg):
        self.direction = self.Directions[msg.get(self.msg_key, "released")]
    
class Joystick():
    def __init__(self, msg_key, threshold):
        self.msg_key = msg_key
        self.threshold = threshold
        
        self.axis_x = 0.0
        self.axis_y = 0.0
    
    def update(self, msg):
        self.axis_x   = float(msg.get(self.msg_key+"_axis_x", 0))
        self.axis_y   = float(msg.get(self.msg_key+"_axis_y", 0))
    
    def getInput(self):
        # Stick deadzone
    	if (self.axis_x > -self.threshold and self.axis_x < self.threshold):
    			x = 0
    	if (self.axis_y > -self.threshold and self.axis_y < self.threshold):
    			y = 0
    
    	# convert to polar
    	r = math.hypot(y, x)
    	t = math.atan2(x, y)
    
    	# rotate by 45 degrees
    	t += math.pi / 4
    
    	# back to cartesian
    	left = r * math.cos(t)
    	right = r * math.sin(t)
    
    	# rescale the new coords
    	left = left * math.sqrt(2)
    	right = right * math.sqrt(2)
    
    	# clamp to -1/+1
    	left = max(-1, min(left, 1))
    	right = max(-1, min(right, 1))
        
    	return (left, right)
        
class Trigger():
    def __init__(self, msg_key):
        self.msg_key = msg_key
        self.axis = 0.0
    
    def update(self, msg):
        self.axis = float(msg.get(self.msg_key, 0))
        
class Button():
    def __init__(self, msg_key):
        self.msg_key = msg_key
        self.pressed = False
        
    def update(self, msg):
        self.pressed = msg.get(self.msg_key, False)


class Controller():
    def __init__(self):
        pass


class XBoxOne(Controller):
    def __init__(self):
        
        self.joy_left       = Joystick("left", 8689/32767.0)
        self.joy_right      = Joystick("right", 8689/32767.0)
        
        self.dpad           = DPad("last_dpad")
        
        self.btn_x          = Button("button_X")
        self.btn_y          = Button("button_Y")
        self.btn_b          = Button("button_B")
        self.btn_a          = Button("button_A")
        self.btn_XBOX       = Button("button_XBOX")
        self.btn_view       = Button("button_View")
        self.btn_menu       = Button("button_Menu")
        self.bumper_left    = Button("left_bumber")
        self.bumper_right   = Button("right_bumper")
        
        self.trigger_left   = Trigger("left_trigger")
        self.trigger_right  = Trigger("right_trigger")
        
        
    def updateInputs(self, msg):
        self.joy_left.update(msg)
        self.joy_right.update(msg)
        self.dpad.update(msg)
        self.btn_x.update(msg)
        self.btn_y.update(msg)
        self.btn_b.update(msg)
        self.btn_a.update(msg)
        self.btn_XBOX.update(msg)
        self.btn_view.update(msg)
        self.btn_menu.update(msg)
        self.bumper_left.update(msg)
        self.bumper_right.update(msg)
        self.trigger_left.update(msg)
        self.trigger_right.update(msg)
