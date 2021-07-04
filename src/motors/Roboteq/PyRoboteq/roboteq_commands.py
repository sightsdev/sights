# This file contains the full list of the commands used by the SDC21** motor driver series
# Each constant will be used as a message receiver or sender parameter (Send speed, read speed, etc..)
# Please refer to the roboteq official manual for more information: https://www.roboteq.com/docman-list/motor-controllers-documents-and-files/documentation/user-manual/272-roboteq-controllers-user-manual-v17/file
# IMPORTANT: These constants are for serial use


# 
# Action commands
SET_ACCEL = "!AC" # Set Acceleration
NXT_ACCEL = "!AX" # Next Acceleration
SET_BOOL = "!B" # Bool Varialbe (Not in use)
SPEC_BIND = "!BIND"  # Spectrum Bind
SET_ENC_COUNTER = "!C" # Set encoder counter
SET_BL_COUNTER = "!CB" # Set brushless counter
SET_CANGO = "!CG" # Set motor command via CAN
CAN_SEND = "!CS" # Can send
CSS = "!CSS" # Set SSI Sensor Counter
DRES = "!D0" # reset individual digital outbits
DSET = "!D1" # Set individual digital outbits
DOUT = "!DS" # Set all digital outbits
NXT_DECEL = "!DX" # Next deceleration
EE_SAVE = "!EES" # Save configuration in EEPROM (Saves configuration in motor driver memory)
EM_STOP = "EX" # Initiate emergency stop
GO = "!G" # Got to speed or relative position
GO_TORQUE = "!GIQ" # Go to torque AMPs
GO_TORQUE_2 = "!QID" # Got to torque amps (It is recommended to use the manual before using these commands)
HOME_COUNTER = "!H" # Load home counter
REL_EM_STOP = "!MG" # Release emergency stop
STOP_ALL = "!MS" # Stop in all modes (will stop for channel)
MOT_POS = "!P" # Go to motor absolute desired position
MPOS_REL = "!PR" # Go to relative desired position
NXT_POSR = "!PRX" # NEXT go to relative desired position
NXT_POS = "PX" # NEXT go to absolute desired position
MICRORUN_BASIC = "!R" # MicroRun Basic (View manual for more info)
RC_OUT = "!RC" # Set Puls out
SET_SPEED = "!S" # Set motor speed
STO_SELF_TEST = "!SST" # STO self test
NXT_VELO = "!SX" # Set next velocity
VAR = "!VAR" # set user variable (View manual for more info)
DUAL_DRIVE = "!M" #Send Dual Drive command, one parameter for left and one for right side

# Runtime queries - used to read commands
# Reading commands is used by sending the "?" sign as a request mark.
# refer to the manual for more information

READ_MOTOR_AMPS = "?A" # Read current motor amperage
READ_BATTERY_AMPS = "?BA" # Read battery amps
READ_BL_MOTOR_RPM = "?BS" # Read brushless motor speed in RPM
READ_BLRSPEED = "?BSR" # Read brushless motor speed as 1/100 of max RPM
READ_ABSCNTR = "?C" # Read encoder counter absolute
READ_CAN = "?CAN" # Read raw CAN frame
READ_BLCNTR = "?CB" # Read absolute brushless counter
READ_CAN_COUNT = "?CF" # Read raw CAN received frames count
READ_PEAK_AMPS = "?DPA" # Read DC/Peak Amps
READ_DREACHED = "?DR" # Read destination reached
READ_FLTFLAG = "?FF" # Read fault flags
READ_FID = "?FID" # Read firmware ID
READ_ICL = "?ICL" # Read if RoboCAN node alive
READ_LOCKED = "?LK" # read lock status
READ_MOTCMD = "?M" # Read motor command applied
READ_TEMP = "?T" # Read controller temperature
READ_VOLTS = "?V" # Read voltage measured


# Maintenance commands
# Contains few commands that are used occasionally to peform maintenance functions
# Use these command carefully please!
# Please view the manual for more information (page:258)
# Beware: some commands require safety key - the safety key is: 321654987

CLMOD = "%CLMOD" # Used for motor/sensor setup
CLRST = "%CLRST" # used to factory reset to factory defaults, include a safety key
CLSAV = "%CLSAV" # Save calibrations to flash, include a safety key
DFU = "%DFU" # Update firmware via USB, include a safety key
EELD = "%EELD" # Load parameters from EEPROM
EELOG = "%EELOG" # Dump flash log data
EERST = "%EERST" # Reset factory defaults, include a safety key
EESAV = "%EESAV" # Save configuration in EEPROM
ERASE = "%ERASE" # Erase flash log data
LK = "%LK" # Lock configuration acces, insert your own safety key as password (32-bit number)
RESET = "%RESET" # Reset controller, insert safetykey
SLD = "%SLD" # script load
STIME = "%STIME" # Set controller time
UK = "%UK" # unlock configuration acces, include your safety key (32-bit number)
