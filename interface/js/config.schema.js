const schema = {
    "definitions": {},
    "$schema": "",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "S.A.R.T. Robot Config",
    "description": "Configuration file for a S.A.R.T. based robot.",
    "required": [
        "control",
        "motors",
        "arduino",
        "cameras",
        "sensors",
        "debug"
    ],
    "properties": {
        "network": {
            "$id": "#/properties/network",
            "type": "object",
            "title": "Network Settings",
            "description": "Configure the network settings the robot and interface.",
            "required": [
                "ip"
            ],
            "properties": {
                "ip": {
                    "$id": "#/properties/network/properties/ip",
                    "type": "string",
                    "title": "IP Address",
                    "description": "The interface that websockets will listen on, typically where the S.A.R.T. Interface will be served. The default wildcard will listen on all addresses.",
                    "default": "*",
                    "examples": [
                        "10.0.0.3"
                    ],
                    "pattern": "^(.*)$"
                }
            }
        },
        "control": {
            "$id": "#/properties/control",
            "type": "object",
            "title": "Control Settings",
            "description": "Default settings for controllers.",
            "required": [
                "default_gamepad_speed",
                "default_keyboard_speed"
            ],
            "properties": {
                "default_gamepad_speed": {
                    "$id": "#/properties/control/properties/default_gamepad_speed",
                    "type": "integer",
                    "title": "Default Gamepad Speed",
                    "description": "The default motor speed used by the Gamepad controller.",
                    "default": 3,
                    "examples": [
                        3
                    ],
                    "minimum": 1.0,
                    "maximum": 8.0
                },
                "default_keyboard_speed": {
                    "$id": "#/properties/control/properties/default_keyboard_speed",
                    "type": "integer",
                    "title": "Default Keyboard Speed",
                    "description": "The default motor speed used by the keyboard controller.",
                    "default": 3,
                    "examples": [
                        3
                    ],
                    "minimum": 1.0,
                    "maximum": 8.0
                }
            }
        },
        "motors": {
            "$id": "#/properties/motors",
            "type": "object",
            "title": "Motor Settings",
            "description": "Set the type and configuration of motors used in the robot.",
            "required": [
                "type",
                "port",
                "baudrate",
                "ids"
            ],
            "properties": {
                "type": {
                    "$id": "#/properties/motors/properties/type",
                    "type": "string",
                    "enum": [
                        "dynamixel",
                        "serial",
                        "virtual"
                    ],
                    "title": "Motor Type",
                    "description": "Different types of motor may require additional fields.",
                    "default": "dynamixel",
                    "examples": [
                        "dynamixel",
                        "serial",
                        "virtual"
                    ],
                    "pattern": "^(.*)$"
                },
                "port": {
                    "$id": "#/properties/motors/properties/port",
                    "type": "string",
                    "title": "Serial Port",
                    "description": "The location of the serial device.",
                    "default": "/dev/serial/by-id/",
                    "examples": [
                        "/dev/serial/by-id/usb-Xevelabs_USB2AX_74031303437351B02270-if00"
                    ],
                    "pattern": "^(.*)$"
                },
                "baudrate": {
                    "$id": "#/properties/motors/properties/baudrate",
                    "type": "integer",
                    "title": "Serial Baud Rate",
                    "description": "Baud rate of the serial port. Some common values are listed in the examples.",
                    "default": 1000000,
                    "examples": [
                        1000000,
                        9600,
                        115200
                    ]
                },
                "ids": {
                    "$id": "#/properties/motors/properties/ids",
                    "type": "object",
                    "title": "Servo IDs",
                    "description": "Set the IDs assigned to servos on the left and right sides of the robot.",
                    "required": [
                        "left",
                        "right"
                    ],
                    "properties": {
                        "left": {
                            "$id": "#/properties/motors/properties/ids/properties/left",
                            "type": "array",
                            "title": "Left Servo IDs Array",
                            "description": "The IDs assigned to servos on the left of the robot.",
                            "items": {
                                "$id": "#/properties/motors/properties/ids/properties/left/items",
                                "type": "integer",
                                "title": "Left Servo ID",
                                "description": "An integer representing a servo ID on the left side of the robot.",
                                "examples": [
                                    1,
                                    3
                                ]
                            }
                        },
                        "right": {
                            "$id": "#/properties/motors/properties/ids/properties/right",
                            "type": "array",
                            "title": "Right Servo IDs Array",
                            "description": "The IDs assigned to servos on the right of the robot.",
                            "items": {
                                "$id": "#/properties/motors/properties/ids/properties/right/items",
                                "type": "integer",
                                "title": "Right Servo ID",
                                "description": "An integer representing a servo ID on the right side of the robot.",
                                "examples": [
                                    2,
                                    4
                                ]
                            }
                        }
                    }
                }
            }
        },
        "arduino": {
            "$id": "#/properties/arduino",
            "type": "object",
            "title": "Arduino Settings",
            "description": "Enable and configure the location of the robot's Arduino for extended sensor capability.",
            "required": [
                "enabled",
                "port",
                "baudrate"
            ],
            "properties": {
                "enabled": {
                    "$id": "#/properties/arduino/properties/enabled",
                    "type": "boolean",
                    "title": "Enable Arduino",
                    "description": "Whether the Arduino is enabled.",
                    "default": false,
                    "examples": [
                        true,
                        false
                    ]
                },
                "port": {
                    "$id": "#/properties/arduino/properties/port",
                    "type": "string",
                    "title": "Arduino Port",
                    "description": "The location of the Arduino serial device.",
                    "default": "/dev/serial/by-id/",
                    "examples": [
                        "/dev/serial/by-id/usb-UDOO_UDOO_X86__K73504309-if00"
                    ],
                    "pattern": "^(.*)$"
                },
                "baudrate": {
                    "$id": "#/properties/arduino/properties/baudrate",
                    "type": "integer",
                    "title": "Arduino Baud Rate",
                    "description": "Baud rate of the serial port. Some common values are listed in the examples.",
                    "default": 115200,
                    "examples": [
                        115200
                    ]
                }
            }
        },
        "cameras": {
            "$id": "#/properties/cameras",
            "type": "object",
            "title": "Camera Settings",
            "description": "Enable and configure the ID and location of up to 4 camera streams.",
            "required": [
                "front",
                "back",
                "left",
                "right"
            ],
            "properties": {
                "front": {
                    "$id": "#/properties/cameras/properties/front",
                    "type": "object",
                    "title": "Front Camera",
                    "description": "Enable and configure the ID of the front camera.",
                    "required": [
                        "enabled",
                        "id"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/front/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Front Camera",
                            "description": "Whether the front camera is enabled",
                            "default": true,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/front/properties/id",
                            "type": "integer",
                            "title": "Front Camera ID",
                            "description": "The ID of the front camera, also set in the Motion config.",
                            "default": 1,
                            "examples": [
                                1
                            ]
                        }
                    }
                },
                "back": {
                    "$id": "#/properties/cameras/properties/back",
                    "type": "object",
                    "title": "Back Camera",
                    "description": "Enable and configure the ID of the back camera.",
                    "required": [
                        "enabled",
                        "id"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/back/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Back Camera",
                            "description": "Whether the back camera is enabled.",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/back/properties/id",
                            "type": "integer",
                            "title": "Back Camera ID",
                            "description": "The ID of the back camera, also set in the Motion config.",
                            "default": 2,
                            "examples": [
                                2
                            ]
                        }
                    }
                },
                "left": {
                    "$id": "#/properties/cameras/properties/left",
                    "type": "object",
                    "title": "Left Camera",
                    "description": "Enable and configure the ID of the left camera.",
                    "required": [
                        "enabled",
                        "id"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/left/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Left Camera",
                            "description": "Whether the left camera is enabled.",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/left/properties/id",
                            "type": "integer",
                            "title": "Left Camera ID",
                            "description": "The ID of the left camera, also set in the Motion config.",
                            "default": 3,
                            "examples": [
                                3
                            ]
                        }
                    }
                },
                "right": {
                    "$id": "#/properties/cameras/properties/right",
                    "type": "object",
                    "title": "Right Camera",
                    "description": "Enable and configure the ID of the right camera",
                    "required": [
                        "enabled",
                        "id"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/right/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Right Camera",
                            "description": "Whether the right camera is enabled",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/right/properties/id",
                            "type": "integer",
                            "title": "Right Camera ID",
                            "description": "The ID of the right camera, also set in the Motion config",
                            "default": 4,
                            "examples": [
                                4
                            ]
                        }
                    }
                }
            }
        },
        "sensors": {
            "$id": "#/properties/sensors",
            "type": "object",
            "title": "Sensor Settings",
            "description": "Enable and configure individual sensor streams.",
            "required": [
                "memory",
                "cpu_temp",
                "thermal_camera",
                "temperature",
                "distance",
                "gas"
            ],
            "properties": {
                "memory": {
                    "$id": "#/properties/sensors/properties/memory",
                    "type": "object",
                    "title": "System Memory Reporting",
                    "description": "Collects and displays system memory usage information on the interface.",
                    "required": [
                        "enabled",
                        "frequency"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/sensors/properties/memory/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Memory Reporting",
                            "description": "Whether system memory usage information is reported.",
                            "default": true,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "frequency": {
                            "$id": "#/properties/sensors/properties/memory/properties/frequency",
                            "type": "integer",
                            "title": "Memory Reporting Update Frequency",
                            "description": "How often, in seconds, memory usage statistics are collected and updated.",
                            "default": 3,
                            "examples": [
                                3
                            ]
                        }
                    }
                },
                "cpu_temp": {
                    "$id": "#/properties/sensors/properties/cpu_temp",
                    "type": "object",
                    "title": "CPU Temperature Reporting",
                    "description": "Collects and displays system CPU temperature information on the interface.",
                    "required": [
                        "enabled",
                        "frequency"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/sensors/properties/cpu_temp/properties/enabled",
                            "type": "boolean",
                            "title": "Enable CPU Temperature Reporting",
                            "description": "Whether system CPU temperature information is reported",
                            "default": true,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "frequency": {
                            "$id": "#/properties/sensors/properties/cpu_temp/properties/frequency",
                            "type": "integer",
                            "title": "CPU Temperature Reporting Update Frequency",
                            "description": "How often, in seconds, CPU temperature statistics are collected and updated.",
                            "default": 5,
                            "examples": [
                                5
                            ]
                        }
                    }
                },
                "thermal_camera": {
                    "$id": "#/properties/sensors/properties/thermal_camera",
                    "type": "object",
                    "title": "Thermal Camera Settings",
                    "description": "Enable and configure the thermal camera stream.",
                    "required": [
                        "enabled",
                        "frequency",
                        "width",
                        "height"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/sensors/properties/thermal_camera/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Thermal Camera",
                            "description": "Whether the thermal camera is enabled.",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "frequency": {
                            "$id": "#/properties/sensors/properties/thermal_camera/properties/frequency",
                            "type": "number",
                            "title": "Thermal Camera Update Frequency",
                            "description": "How often, in seconds, thermal camera frames are sent.",
                            "default": 0.5,
                            "examples": [
                                0.5
                            ]
                        },
                        "width": {
                            "$id": "#/properties/sensors/properties/thermal_camera/properties/width",
                            "type": "integer",
                            "title": "Thermal Camera Width",
                            "description": "The width, in pixels, of the thermal camera.",
                            "examples": [
                                32
                            ]
                        },
                        "height": {
                            "$id": "#/properties/sensors/properties/thermal_camera/properties/height",
                            "type": "integer",
                            "title": "Thermal Camera Height",
                            "description": "The height, in pixels, of the thermal camera.",
                            "examples": [
                                24
                            ]
                        }
                    }
                },
                "temperature": {
                    "$id": "#/properties/sensors/properties/temperature",
                    "type": "object",
                    "title": "Ambient Temperature Settings",
                    "description": "Enable and configure the ambient temperature sensor.",
                    "required": [
                        "enabled",
                        "frequency",
                        "address"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/sensors/properties/temperature/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Ambient Temperature Sensor",
                            "description": "Whether the ambient temperature sensor is enabled.",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "frequency": {
                            "$id": "#/properties/sensors/properties/temperature/properties/frequency",
                            "type": "integer",
                            "title": "Ambient Temperature Sensor Update Frequency",
                            "description": "How often, in seconds, ambient temperature is recorded and updated.",
                            "default": 2,
                            "examples": [
                                2
                            ]
                        },
                        "address": {
                            "$id": "#/properties/sensors/properties/temperature/properties/address",
                            "type": "string",
                            "title": "Ambient Temperature Address",
                            "description": "I2C device address of the ambient temperature sensor.",
                            "examples": [
                                "0x5A"
                            ],
                            "pattern": "^(.*)$"
                        }
                    }
                },
                "distance": {
                    "$id": "#/properties/sensors/properties/distance",
                    "type": "object",
                    "title": "Distance Sensor Array Settings",
                    "description": "Enable and configure the distance sensor array",
                    "required": [
                        "enabled",
                        "frequency"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/sensors/properties/distance/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Distance Sensor Array",
                            "description": "Whether the distance sensor array is enabled.",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "frequency": {
                            "$id": "#/properties/sensors/properties/distance/properties/frequency",
                            "type": "integer",
                            "title": "Distance Sensor Array Update Frequency",
                            "description": "How often, in seconds, distance is recorded and updated.",
                            "default": 2,
                            "examples": [
                                2
                            ]
                        }
                    }
                },
                "gas": {
                    "$id": "#/properties/sensors/properties/gas",
                    "type": "object",
                    "title": "Gas Sensor Settings",
                    "description": "Enable and configure the CO2/VOC sensor.",
                    "required": [
                        "enabled",
                        "frequency"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/sensors/properties/gas/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Gas Sensor",
                            "description": "Whether the CO2/VOC sensor is enabled.",
                            "default": false,
                            "examples": [
                                true,
                                false
                            ]
                        },
                        "frequency": {
                            "$id": "#/properties/sensors/properties/gas/properties/frequency",
                            "type": "integer",
                            "title": "Gas Sensor Update Frequency",
                            "description": "How often, in seconds, the CO2 and VOC concentrations are recorded and updated.",
                            "default": 2,
                            "examples": [
                                2
                            ]
                        }
                    }
                }
            }
        },
        "debug": {
            "$id": "#/properties/debug",
            "type": "object",
            "title": "Debug Settings",
            "description": "Settings useful for developers.",
            "required": [
                "print_messages"
            ],
            "properties": {
                "print_messages": {
                    "$id": "#/properties/debug/properties/print_messages",
                    "type": "boolean",
                    "title": "Enable Debug Messages",
                    "description": "Log additional debug messages.",
                    "default": false,
                    "examples": [
                        true,
                        false
                    ]
                }
            }
        }
    }
};
