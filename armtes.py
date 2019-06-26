# -*- coding: utf-8 -*-
"""
Created on Wed Jun 26 14:28:38 2019

@author: Alexander_Cavalli
"""

from SARTRobots import MarkIV
import threading

def quitOn():
    global FLAG_QUIT
    global toQuit
    while 1:
        key=input("")
        if key in toQuit:
            FLAG_QUIT = True
            print(("quitting on %s" % key))
            break

FLAG_QUIT = False
toQuit=["\n", "\r", "", "quit", "q"]

mkIV = MarkIV(arm=True, port="COM8")

mkIV.enable()


quitter = threading.Thread(target=quitOn)
quitter.start()

while 1:
    mkIV.motors.setGoalPos(0, True)

