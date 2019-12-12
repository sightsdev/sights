const schema = {
    "definitions": {
    },
    "$schema": "http://json-schema.org/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "SIGHTS Robot Config",
    "description": "Configuration file for a S.A.R.T. SIGHTS-based robot.",
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
            "options": {
                "collapsed": true
            },
            "title": "Network",
            "description": "Configure the network settings for the robot and interface.",
            "required": [
                "ip"
            ],
            "properties": {
                "ip": {
                    "$id": "#/properties/network/properties/ip",
                    "type": "string",
                    "title": "IP Address",
                    "description": "The interface that websockets will listen on, typically where the S.A.R.T. Interface will be served. The default wildcard (*) will listen on all addresses.",
                    "default": "*",
                    "pattern": "^(.*)$"
                }
            }
        },
        "control": {
            "$id": "#/properties/control",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Control",
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
                    "description": "The default motor speed (1-8) when using a gamepad.",
                    "format": "range",
                    "default": 3,
                    "minimum": 1.0,
                    "maximum": 8.0
                },
                "default_keyboard_speed": {
                    "$id": "#/properties/control/properties/default_keyboard_speed",
                    "type": "integer",
                    "title": "Default Keyboard Speed",
                    "description": "The default motor speed (1-8) when using the keyboard.",
                    "format": "range",
                    "default": 3,
                    "minimum": 1.0,
                    "maximum": 8.0
                }
            }
        },
        "motors": {
            "$id": "#/properties/motors",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Motors",
            "description": "Set the type, configuration and number of motors used in the robot.",
            "required": [
                "type"
            ],
            "properties": {
                "type": {
                    "$id": "#/properties/motors/properties/type",
                    "type": "string",
                    "format": "radio",
                    "enum": [
                        "dynamixel",
                        "serial",
                        "virtual"
                    ],
                    "title": "Motor Type",
                    "description": "dynamixel (Dynamixel AX-series servos), serial (Sabertooth motor controllers), virtual (virtual motor connection for testing without motors).",
                    "default": "dynamixel",
                    "pattern": "^(.*)$"
                },
                "port": {
                    "$id": "#/properties/motors/properties/port",
                    "type": "string",
                    "title": "Serial Port",
                    "description": "The location of the serial device.",
                    "default": "/dev/serial/by-id/",
                    "pattern": "^(.*)$",
                    "options": {
                        "dependencies": {
                            "type": [
                                "dynamixel",
                                "serial"
                            ]
                        }
                    }
                },
                "baudrate": {
                    "$id": "#/properties/motors/properties/baudrate",
                    "type": "integer",
                    "title": "Serial Baud Rate",
                    "description": "Baud rate of the serial port. Some common values include 1000000 for dynamixel or 9600 for serial.",
                    "default": 1000000,
                    "options": {
                        "dependencies": {
                            "type": [
                                "dynamixel",
                                "serial"
                            ]
                        }
                    }
                },
                "ids": {
                    "$id": "#/properties/motors/properties/ids",
                    "type": "object",
                    "title": "Servo IDs",
                    "description": "Configure Dynamixel ID assignment for each motor group. 'Left' and 'right' groups define which servos are on the left and right side. Multiple servos can be added to each group.",
                    "options": {
                        "dependencies": {
                            "type": "dynamixel"
                        }
                    },
                    "required": [
                        "left",
                        "right"
                    ],
                    "properties": {
                        "left": {
                            "$id": "#/properties/motors/properties/ids/properties/left",
                            "type": "array",
                            "format": "table",
                            "title": "Left Servo IDs Array",
                            "description": "The IDs assigned to servos on the left of the robot.",
                            "items": {
                                "$id": "#/properties/motors/properties/ids/properties/left/items",
                                "type": "integer",
                                "title": "Left Servo ID",
                                "description": "An integer representing a servo ID on the left side of the robot."
                            }
                        },
                        "right": {
                            "$id": "#/properties/motors/properties/ids/properties/right",
                            "type": "array",
                            "format": "table",
                            "title": "Right Servo IDs Array",
                            "description": "The IDs assigned to servos on the right of the robot.",
                            "items": {
                                "$id": "#/properties/motors/properties/ids/properties/right/items",
                                "type": "integer",
                                "title": "Right Servo ID",
                                "description": "An integer representing a servo ID on the right side of the robot."
                            }
                        }
                    }
                }
            }
        },
        "arduino": {
            "$id": "#/properties/arduino",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Arduino",
            "description": "Enable and configure the location of the robot's Arduino for extended sensor capability.",
            "required": [
                "enabled"
            ],
            "properties": {
                "enabled": {
                    "$id": "#/properties/arduino/properties/enabled",
                    "type": "boolean",
                    "title": "Enable Arduino",
                    "description": "Whether the Arduino is enabled.",
                    "format": "checkbox",
                    "default": false
                },
                "port": {
                    "$id": "#/properties/arduino/properties/port",
                    "type": "string",
                    "title": "Arduino Port",
                    "description": "The location of the Arduino serial device.",
                    "default": "/dev/serial/by-id/",
                    "pattern": "^(.*)$",
                    "options": {
                        "dependencies": {
                            "enabled": true
                        }
                    }
                },
                "baudrate": {
                    "$id": "#/properties/arduino/properties/baudrate",
                    "type": "integer",
                    "title": "Arduino Baud Rate",
                    "description": "Baud rate of the serial port. Commonly set to 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 28800, 38400, 57600 or 115200.",
                    "default": 115200,
                    "options": {
                        "dependencies": {
                            "enabled": true
                        }
                    }
                }
            }
        },
        "cameras": {
            "$id": "#/properties/cameras",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Cameras",
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
                    "format": "grid",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Front Camera",
                    "description": "Enable and configure the front camera.",
                    "required": [
                        "enabled"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/front/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Front Camera",
                            "description": "Whether the front camera is enabled.",
                            "format": "checkbox",
                            "default": true
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/front/properties/id",
                            "type": "integer",
                            "title": "Front Camera ID",
                            "description": "The ID of the front camera. This should be the same as the ID set in the motion config for this camera.",
                            "default": 1,
                            "options": {
                                "dependencies": {
                                    "enabled": true
                                }
                            }
                        }
                    }
                },
                "back": {
                    "$id": "#/properties/cameras/properties/back",
                    "type": "object",
                    "format": "grid",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Back Camera",
                    "description": "Enable and configure the back camera.",
                    "required": [
                        "enabled"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/back/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Back Camera",
                            "description": "Whether the back camera is enabled.",
                            "format": "checkbox",
                            "default": false
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/back/properties/id",
                            "type": "integer",
                            "title": "Back Camera ID",
                            "description": "The ID of the back camera. This should be the same as the ID set in the motion config for this camera.",
                            "default": 2,
                            "options": {
                                "dependencies": {
                                    "enabled": true
                                }
                            }
                        }
                    }
                },
                "left": {
                    "$id": "#/properties/cameras/properties/left",
                    "type": "object",
                    "format": "grid",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Left Camera",
                    "description": "Enable and configure the left camera.",
                    "required": [
                        "enabled"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/left/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Left Camera",
                            "description": "Whether the left camera is enabled.",
                            "format": "checkbox",
                            "default": false
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/left/properties/id",
                            "type": "integer",
                            "title": "Left Camera ID",
                            "description": "The ID of the left camera. This should be the same as the ID set in the motion config for this camera.",
                            "default": 3,
                            "options": {
                                "dependencies": {
                                    "enabled": true
                                }
                            }
                        }
                    }
                },
                "right": {
                    "$id": "#/properties/cameras/properties/right",
                    "type": "object",
                    "format": "grid",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Right Camera",
                    "description": "Enable and configure the right camera.",
                    "required": [
                        "enabled"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/cameras/properties/right/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Right Camera",
                            "description": "Whether the right camera is enabled.",
                            "format": "checkbox",
                            "default": false
                        },
                        "id": {
                            "$id": "#/properties/cameras/properties/right/properties/id",
                            "type": "integer",
                            "title": "Right Camera ID",
                            "description": "The ID of the right camera. This should be the same as the ID set in the motion config for this camera.",
                            "default": 4,
                            "options": {
                                "dependencies": {
                                    "enabled": true
                                }
                            }
                        }
                    }
                }
            }
        },
        "sensors": {
            "$id": "#/properties/sensors",
            "type": "array",
            "format": "table",
            "options": {
                "collapsed": true
            },
            "title": "Sensors",
            "description": "Enable and configure individual sensor streams.",
            "items": {
                "anyOf": [
                    {
                        "type": "object",
                        "title": "MLX90614 (Temperature)",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the MLX90614 sensor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "mlx90614"
                                ],
                                "default": "mlx90614",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the MLX90614 sensor.",
                                "default": "New Sensor"
                            },
                            "address": {
                                "type": "string",
                                "title": "Address",
                                "description": "I2C device address of the MLX90614 sensor."
                            },
                            "frequency": {
                                "type": "integer",
                                "title": "Update Frequency",
                                "description": "How often, in seconds, the MLX90614 sensor is polled.",
                                "default": 3
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "SGP30 (Gas)",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the SGP30 sensor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "sgp30"
                                ],
                                "default": "sgp30",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the SGP30 sensor.",
                                "default": "New Sensor"
                            },
                            "frequency": {
                                "type": "integer",
                                "title": "Update Frequency",
                                "description": "How often, in seconds, the SGP30 sensor is polled.",
                                "default": 3
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "AMG8833 (Thermal Camera)",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the AMG8833 thermal camera is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "amg8833"
                                ],
                                "default": "amg8833",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the AMG8833 thermal camera.",
                                "default": "New Sensor"
                            },
                            "frequency": {
                                "type": "integer",
                                "title": "Update Frequency",
                                "description": "How often, in seconds, frames are pulled from the AMG8833 thermal camera.",
                                "default": 3
                            },
                            "width": {
                                "type": "integer",
                                "title": "Thermal Camera Width",
                                "description": "The width, in pixels, of the thermal camera."
                            },
                            "height": {
                                "type": "integer",
                                "title": "Thermal Camera Height",
                                "description": "The height, in pixels, of the thermal camera."
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "Host Memory Usage Monitor",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the memory monitor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "memory"
                                ],
                                "default": "memory",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the memory monitor.",
                                "default": "New Sensor"
                            },
                            "frequency": {
                                "type": "integer",
                                "title": "Update Frequency",
                                "description": "How often, in seconds, the memory monitor updates.",
                                "default": 3
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "Host CPU Temperature Monitor",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the CPU temperature monitor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "cpu_temp"
                                ],
                                "default": "cpu_temp",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the CPU temperature monitor.",
                                "default": "New Sensor"
                            },
                            "frequency": {
                                "type": "integer",
                                "title": "Update Frequency",
                                "description": "How often, in seconds, the CPU temperature monitor updates.",
                                "default": 3
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "Custom Sensor",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable Sensor",
                                "description": "Whether the custom sensor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Sensor Type",
                                "description": "The type of custom sensor wrapper to use when polling the sensor."
                            },
                            "name": {
                                "type": "string",
                                "title": "Sensor Name",
                                "description": "The pretty name for the custom sensor.",
                                "default": "New Sensor"
                            },
                            "address": {
                                "type": "string",
                                "title": "Sensor Address",
                                "description": "I2C (or similar) device address of the custom sensor, if required by your custom sensor wrapper."
                            },
                            "frequency": {
                                "type": "integer",
                                "title": "Sensor Update Frequency",
                                "description": "How often, in seconds, the custom sensor is polled.",
                                "default": 3
                            }
                        }
                    }
                ]
            }
        },
        "debug": {
            "$id": "#/properties/debug",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Debug",
            "description": "Settings useful for developers.",
            "required": [
                "print_messages"
            ],
            "properties": {
                "print_messages": {
                    "$id": "#/properties/debug/properties/print_messages",
                    "type": "boolean",
                    "title": "Enable Message Logging",
                    "description": "Log messages received from the interface.",
                    "format": "checkbox",
                    "default": false
                }
            }
        }
    }
};
