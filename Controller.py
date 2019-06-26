#!/usr/bin/env python2
# -*- coding: utf-8 -*-
"""
Created on Fri May 31 15:27:27 2019

@author: sart
"""

class DPad():
    
    def __init__(self, msg_key):
        self.up = Button(msg_key+"_up")
        self.down = Button(msg_key+"_down")
        self.left = Button(msg_key+"_left")
        self.right = Button(msg_key+"_right")
        self.axis_x = 0.0
        self.axis_y = 0.0
        
    def update(self, msg):
#        self.direction = self.Directions[msg.get(self.msg_key, "released")]
        self.up.update(msg)
        self.down.update(msg)
        self.left.update(msg)
        self.right.update(msg)
        self.axis_x = float(self.right.pressed)-float(self.left.pressed)
        self.axis_y = float(self.down.pressed)-float(self.up.pressed)
    
class Joystick():
    def __init__(self, msg_key, threshold):
        self.msg_key = msg_key
        self.threshold = threshold
        self.axis_x = 0.0
        self.axis_y = 0.0
    
    def update(self, msg):
        self.axis_x   = float(msg.get(self.msg_key+"_axis_x", 0))
        self.axis_y   = float(msg.get(self.msg_key+"_axis_y", 0))
    
    def getValid(self):
        # Stick deadzone
    	x = self.axis_x
    	y = self.axis_y
    	if (self.axis_x > -self.threshold and self.axis_x < self.threshold):
    			x = 0
    	if (self.axis_y > -self.threshold and self.axis_y < self.threshold):
    			y = 0
    	return (x, y)
    
    def valid(self):
        return (self.axis_x > self.threshold) or (self.axis_y > self.threshold)
        
class Trigger():
    def __init__(self, msg_key):
        self.msg_key = msg_key
        self.axis = 0.0
        self.changed = False
    
    def update(self, msg):
        self.axis = float(msg.get(self.msg_key, 0))
        
class Button():
    def __init__(self, msg_key):
        self.msg_key = msg_key
        self.pressed = False
        self.changed = False
        
    def update(self, msg):
        self.pressed = msg.get(self.msg_key, False)
        self.changed = True
        
    def singlePress(self):
        val =  self.pressed and self.changed
        self.changed = False
        return val


class Controller():
    def __init__(self):
        pass


class XBoxOne(Controller):
    def __init__(self):
        
        self.joy_left       = Joystick("left", 8689/32767.0)
        self.joy_right      = Joystick("right", 8689/32767.0)
        
        self.btn_l3         = Button("left_stick")
        self.btn_r3         = Button("right_stick")
        
        self.dpad           = DPad("pad")
#        self.dpad_up          = Button("pad_up")
#        self.dpad_down          = Button("pad_down")
#        self.dpad_left          = Button("pad_left")
#        self.dpad_right          = Button("pad_right")
        
        
        self.btn_x          = Button("button_X")
        self.btn_y          = Button("button_Y")
        self.btn_b          = Button("button_B")
        self.btn_a          = Button("button_A")
        
        self.btn_XBOX       = Button("center")
        self.btn_view       = Button("button_select")
        self.btn_menu       = Button("button_start")
        
        self.bumper_left    = Button("left_bumper")
        self.bumper_right   = Button("right_bumper")
        
        self.trigger_left   = Trigger("left_trigger")
        self.trigger_right  = Trigger("right_trigger")
        
        
    def updateInputs(self, msg):
        self.joy_left.update(msg)
        self.joy_right.update(msg)
        self.dpad.update(msg)
#        self.dpad_up.update(msg)
#        self.dpad_down.update(msg)
#        self.dpad_left.update(msg)
#        self.dpad_right.update(msg)
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
