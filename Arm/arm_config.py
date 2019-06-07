import pypot.robot
import json
import time
arm_config = {
    'controllers': {
        'my_dxl_controller': {
            'sync_read': False,
            'attached_motors': ['shoulder','elbow','wrist','pincher'],
            'port': '/dev/ttyUSB0'
        }
    },
    'motorgroups': {
        'shoulder': ['sl', 'sr',],
        'elbow': ['el', 'er'],
	'wrist':['w_roll', 'w_pitch']
    },
    'motors': {
        'sr': {
            'orientation': 'direct',
            'type': 'XL430-W250',
            'id': 2,
            'angle_limit': [-90.0, 90.0],
            'offset': 0.0
        },
        'sl': {
            'orientation': 'indirect',
            'type': 'XL430-W250',
            'id': 3,
            'angle_limit': [-90.0, 90.0],
            'offset': 0.0
        },
        'er': {
            'orientation': 'direct',
            'type': 'XL430-W250',
            'id': 4,
            'angle_limit': [-90.0, 90.0],
            'offset': 0.0
        },
        'el': {
            'orientation': 'indirect',
            'type': 'XL430-W250',
	       'id': 5,
            'angle_limit': [-90.0, 90.0],
            'offset': 0.0
        },
        'w_pitch': {
            'orientation': 'direct',
            'type': 'XL430-W250',
            'id': 6,
            'angle_limit': [-90.0, 90.0],
            'offset': 0.0
        },
        'w_roll': {
            'orientation': 'direct',
            'type': 'XL430-W250',
            'id': 7,
            'angle_limit': [-180.0, 180.0],
            'offset': 0.0
        },
	   'pincher': {
            'orientation': 'indirect',
            'type': 'XL430-W250',
            'id': 8,
            'angle_limit': [-90.0, 90.0],
            'offset': 0.0,
        }
    }
}

robot = pypot.robot.from_json("my_robot.json")

time.sleep(2)

print(len(robot.motors))

for m in robot.motors:
    print(m)
