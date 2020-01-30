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
        "interface",
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
        "interface": {
            "$id": "#/properties/interface",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Interface",
            "description": "Configure and personalise the Interface for this robot configuration.",
            "required": [
                "cameras",
                "graphs"
            ],
            "properties": {
                "notifications": {
                    "$id": "#/properties/interface/properties/notifications",
                    "type": "object",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Notifications",
                    "description": "Enable and configure toast alerts and notifications on the interface.",
                    "required": [
                        "enabled"
                    ],
                    "properties": {
                        "enabled": {
                            "$id": "#/properties/interface/properties/notifications/properties/enabled",
                            "type": "boolean",
                            "title": "Enable Notifications",
                            "description": "Whether notifications are enabled.",
                            "format": "checkbox",
                            "default": true
                        },
                        "timeout": {
                            "$id": "#/properties/interface/properties/notifications/properties/timeout",
                            "type": "integer",
                            "title": "Notification Timeout",
                            "description": "Automatically dismiss notifications after this many seconds. Set to 0 to disable.",
                            "default": 7,
                            "options": {
                                "dependencies": {
                                    "enabled": true
                                }
                            }
                        }
                    }
                },
                "cameras": {
                    "$id": "#/properties/interface/properties/cameras",
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
                            "$id": "#/properties/interface/properties/cameras/properties/front",
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
                                    "$id": "#/properties/interface/properties/cameras/properties/front/properties/enabled",
                                    "type": "boolean",
                                    "title": "Enable Front Camera",
                                    "description": "Whether the front camera is enabled.",
                                    "format": "checkbox",
                                    "default": true
                                },
                                "id": {
                                    "$id": "#/properties/interface/properties/cameras/properties/front/properties/id",
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
                            "$id": "#/properties/interface/properties/cameras/properties/back",
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
                                    "$id": "#/properties/interface/properties/cameras/properties/back/properties/enabled",
                                    "type": "boolean",
                                    "title": "Enable Back Camera",
                                    "description": "Whether the back camera is enabled.",
                                    "format": "checkbox",
                                    "default": false
                                },
                                "id": {
                                    "$id": "#/properties/interface/properties/cameras/properties/back/properties/id",
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
                            "$id": "#/properties/interface/properties/cameras/properties/left",
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
                                    "$id": "#/properties/interface/properties/cameras/properties/left/properties/enabled",
                                    "type": "boolean",
                                    "title": "Enable Left Camera",
                                    "description": "Whether the left camera is enabled.",
                                    "format": "checkbox",
                                    "default": false
                                },
                                "id": {
                                    "$id": "#/properties/interface/properties/cameras/properties/left/properties/id",
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
                            "$id": "#/properties/interface/properties/cameras/properties/right",
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
                                    "$id": "#/properties/interface/properties/cameras/properties/right/properties/enabled",
                                    "type": "boolean",
                                    "title": "Enable Right Camera",
                                    "description": "Whether the right camera is enabled.",
                                    "format": "checkbox",
                                    "default": false
                                },
                                "id": {
                                    "$id": "#/properties/interface/properties/cameras/properties/right/properties/id",
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
                "graphs": {
                    "$id": "#/properties/interface/properties/graphs",
                    "type": "array",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Graphs",
                    "description": "Configure the graphs on which sensor data is displayed on the Interface",
                    "items": {
                        "anyOf": [
                            {
                                "type": "object",
                                "options": {
                                    "collapsed": true
                                },
                                "title": "Line Graph",
                                "properties": {
                                    "uid": {
                                        "type": "string",
                                        "title": "Unique ID",
                                        "description": "The UID used to identify the graph. Used in sensor configuration to determine what graph a sensor's data is displayed on."
                                    },
                                    "type": {
                                        "type": "string",
                                        "title": "Type",
                                        "description": "The type of graph to use.",
                                        "enum": [
                                            "line"
                                        ],
                                        "default": "line",
                                        "format": "radio"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Enable",
                                        "description": "Whether the graph is enabled.",
                                        "format": "checkbox",
                                        "default": true
                                    },
                                    "location": {
                                        "type": "string",
                                        "title": "Location",
                                        "description": "Element to append the graph to.",
                                        "default": "#"
                                    },
                                    "title": {
                                        "type": "string",
                                        "title": "Title",
                                        "description": "Title displayed on the graph.",
                                        "default": "Graph"
                                    },
                                    "icon": {
                                        "type": "string",
                                        "title": "Icon",
                                        "description": "Font Awesome icon displayed on the graph.",
                                        "default": "line-chart"
                                    },
                                    "x_axis_label": {
                                        "type": "string",
                                        "title": "X-axis Label",
                                        "description": "Label displayed on the graph's x-axis.",
                                        "default": "x axis"
                                    },
                                    "y_axis_label": {
                                        "type": "string",
                                        "title": "Y-axis Label",
                                        "description": "Label displayed on the graph's y-axis.",
                                        "default": "y axis"
                                    },
                                    "y_axis_min": {
                                        "type": "integer",
                                        "title": "Y-axis Minimum",
                                        "required": false,
                                        "default": null,
                                        "description": "Optional minimum for the y-axis"
                                    },
                                    "y_axis_max": {
                                        "type": "integer",
                                        "title": "Y-axis Maximum",
                                        "required": false,
                                        "default": null,
                                        "description": "Optional maximum for the y-axis"
                                    },
                                    "period": {
                                        "type": "number",
                                        "title": "Period",
                                        "default": 1,
                                        "description": "How often the graph updates, in seconds. Should ideally be the same as the sensor/s used on this graph."
                                    }
                                }
                            },
                            {
                                "type": "object",
                                "options": {
                                    "collapsed": true
                                },
                                "title": "Circle Graph",
                                "properties": {
                                    "uid": {
                                        "type": "string",
                                        "title": "Unique ID",
                                        "description": "The UID used to identify the graph. Used in sensor configuration to determine what graph a sensor's data is displayed on."
                                    },
                                    "type": {
                                        "type": "string",
                                        "title": "Type",
                                        "description": "The type of graph to use.",
                                        "enum": [
                                            "circle"
                                        ],
                                        "default": "circle",
                                        "format": "radio"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Enable",
                                        "description": "Whether the graph is enabled.",
                                        "format": "checkbox",
                                        "default": true
                                    },
                                    "location": {
                                        "type": "string",
                                        "title": "Location",
                                        "description": "Element to append the graph to.",
                                        "default": "#"
                                    },
                                    "title": {
                                        "type": "string",
                                        "title": "Title",
                                        "description": "Title displayed on the graph.",
                                        "default": "Graph"
                                    },
                                    "unit": {
                                        "type": "string",
                                        "title": "Units",
                                        "description": "The unit of measurement to display on the readout."
                                    },
                                    "unit_style": {
                                        "type": "string",
                                        "title": "Units Styling",
                                        "default": "font-size: 24px;",
                                        "description": "Inline CSS to style the units text, e.g. to decrease font size if it overflows."
                                    },
                                    "maximum": {
                                        "type": "number",
                                        "title": "Maximum",
                                        "default": 1,
                                        "description": "The maximum value that the sensor can report, used when calculating how full the circle bar should be."
                                    }
                                }
                            },
                            {
                                "type": "object",
                                "options": {
                                    "collapsed": true
                                },
                                "title": "Text Box",
                                "properties": {
                                    "uid": {
                                        "type": "string",
                                        "title": "Unique ID",
                                        "description": "The UID used to identify the text box. Used in sensor configuration to determine what text box a sensor's data is displayed on."
                                    },
                                    "type": {
                                        "type": "string",
                                        "title": "Type",
                                        "description": "The type of graph to use.",
                                        "enum": [
                                            "text"
                                        ],
                                        "default": "text",
                                        "format": "radio"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Enable",
                                        "description": "Whether the text box is enabled.",
                                        "format": "checkbox",
                                        "default": true
                                    },
                                    "location": {
                                        "type": "string",
                                        "title": "Location",
                                        "description": "Element to append the text box to. Recommended to append to a list-group element.",
                                        "default": "#"
                                    },
                                    "title": {
                                        "type": "string",
                                        "title": "Title",
                                        "description": "Title displayed on the text box.",
                                        "default": "Graph"
                                    },
                                    "unit": {
                                        "type": "string",
                                        "title": "Units",
                                        "required": false,
                                        "default": "",
                                        "description": "The unit of measurement to display on the readout (optional)."
                                    },
                                    "maximum": {
                                        "type": "number",
                                        "title": "Maximum",
                                        "required": false,
                                        "default": null,
                                        "description": "The maximum value that the sensor can report (optional)."
                                    }
                                }
                            },
                            {
                                "type": "object",
                                "options": {
                                    "collapsed": true
                                },
                                "title": "Thermal Camera Output",
                                "properties": {
                                    "uid": {
                                        "type": "string",
                                        "title": "Unique ID",
                                        "description": "The UID used to identify the graph. Used in sensor configuration to determine what graph a sensor's data is displayed on."
                                    },
                                    "type": {
                                        "type": "string",
                                        "title": "Type",
                                        "description": "The type of graph to use.",
                                        "enum": [
                                            "thermalcamera"
                                        ],
                                        "default": "thermalcamera",
                                        "format": "radio"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Enable",
                                        "description": "Whether the graph is enabled.",
                                        "format": "checkbox",
                                        "default": true
                                    },
                                    "location": {
                                        "type": "string",
                                        "title": "Location",
                                        "description": "Element to append the graph to.",
                                        "default": "#"
                                    },
                                    "title": {
                                        "type": "string",
                                        "title": "Title",
                                        "description": "Title displayed on the graph.",
                                        "default": "Thermal Camera"
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
                                    },
                                    "camera": {
                                        "type": "string",
                                        "title": "Default Thermal Camera Overlay Camera",
                                        "required": false,
                                        "enum": [
                                            "default",
                                            "front",
                                            "back",
                                            "left",
                                            "right"
                                        ],
                                        "format": "radio",
                                        "default": 'default',
                                        "description": "Sets the default visible light camera to overlay the thermal camera on (optional)."
                                    },
                                    "opacity": {
                                        "type": "integer",
                                        "title": "Default Thermal Camera Opacity",
                                        "required": false,
                                        "default": null,
                                        "description": "Sets the default opacity (0 - 100%) of the thermal camera when overlayed (optional).",
                                        "format": "range",
                                        "default": 25,
                                        "minimum": 0,
                                        "maximum": 100
                                    },
                                    "xscale": {
                                        "type": "integer",
                                        "title": "Default Thermal Camera X Scale",
                                        "required": false,
                                        "default": null,
                                        "description": "Sets the default x scale (50 - 150%) of the thermal camera when overlayed (optional).",
                                        "format": "range",
                                        "default": 100,
                                        "minimum": 50,
                                        "maximum": 150
                                    },
                                    "yscale": {
                                        "type": "integer",
                                        "title": "Default Thermal Camera Y Scale",
                                        "required": false,
                                        "default": null,
                                        "description": "Sets the default y scale (50 - 150%) of the thermal camera when overlayed (optional).",
                                        "format": "range",
                                        "default": 100,
                                        "minimum": 50,
                                        "maximum": 150
                                    }
                                }
                            }
                        ],
                        "title": "Graph"
                    }
                },
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
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the MLX90614 sensor is polled.",
                                "default": 3
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
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
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the SGP30 sensor is polled.",
                                "default": 3
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
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
                            "period": {
                                "type": "number",
                                "title": "Update Period",
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
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
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
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the memory monitor updates.",
                                "default": 3
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
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
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the CPU temperature monitor updates.",
                                "default": 3
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "Random Data",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable Sensor",
                                "description": "Whether the random data generator is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "random"
                                ],
                                "default": "random",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Random Data Generator Name",
                                "description": "The pretty name for the random data generator.",
                                "default": "New Random Data Generator"
                            },
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, random data is generated.",
                                "default": 3
                            },
                            "min": {
                                "type": "integer",
                                "title": "Minimum Value",
                                "description": "The minimum value of the randomly generated data.",
                                "required": false,
                                "default": null
                            },
                            "max": {
                                "type": "integer",
                                "title": "Maximum Value",
                                "description": "The maximum value of the randomly generated data.",
                                "required": false,
                                "default": null
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
                            }
                        }
                    },
                    {
                        "type": "object",
                        "title": "MultiRandom (Random, Random, Random)",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the MultiRandom sensor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "multirandom"
                                ],
                                "default": "multirandom",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the MultiRandom sensor.",
                                "default": "New Sensor"
                            },
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the MultiRandom sensor is polled.",
                                "default": 3
                            },
                            "display_on": {
                                "type": "object",
                                "title": "Display On",
                                "description": "The MultiRandom sensor is a multi-sensor. Choose how each value is displayed individually.",
                                "options": {
                                    "collapsed": false
                                },
                                "properties": {
                                    "a": {
                                        "type": "array",
                                        "title": "A",
                                        "description": "A list of graph UIDs to display this sensor's A data on.",
                                        "items": {
                                            "type": "string",
                                            "title": "Graph UID"
                                        }
                                    },
                                    "b": {
                                        "type": "array",
                                        "title": "B",
                                        "description": "A list of graph UIDs to display this sensor's B data on.",
                                        "items": {
                                            "type": "string",
                                            "title": "Graph UID"
                                        }
                                    },
                                    "c": {
                                        "type": "array",
                                        "title": "C",
                                        "description": "A list of graph UIDs to display this sensor's C data on.",
                                        "items": {
                                            "type": "string",
                                            "title": "Graph UID"
                                        }
                                    }
                                }
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
                            "period": {
                                "type": "number",
                                "title": "Sensor Update Period",
                                "description": "How often, in seconds, the custom sensor is polled.",
                                "default": 3
                            },
                            "display_on": {
                                "type": "array",
                                "title": "Display On",
                                "description": "A list of graph UIDs to display this sensor's data on.",
                                "items": {
                                    "type": "string",
                                    "title": "Graph UID"
                                }
                            }
                        }
                    }
                ],
                "title": "Sensor"
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
                "log_level",
                "print_messages"
            ],
            "properties": {
                "log_level": {
                    "$id": "#/properties/debug/properties/log_level",
                    "type": "string",
                    "title": "Log Level",
                    "description": "Set the level of logs to output. All lower levels are logged, meaning, for example, if the 'info' level is selected, then warnings, errors and critical messages are also logged.",
                    "enum": [
                        "critcal",
                        "error",
                        "warning",
                        "info",
                        "debug"
                    ],
                    "default": "info"
                },
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
