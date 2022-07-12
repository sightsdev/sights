const schema = {
    "definitions": {
    },
    "$schema": "http://json-schema.org/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "SIGHTS Robot Config",
    "description": "Configuration file for a SIGHTS-based robot.",
    "required": [
        "control",
        "motors",
        "arm",
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
                "default_speed"
            ],
            "properties": {
                "default_speed": {
                    "$id": "#/properties/control/properties/default_speed",
                    "type": "integer",
                    "title": "Default Speed",
                    "description": "The default motor speed (1-8).",
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
                        "simpleserial",
                        "virtual"
                    ],
                    "title": "Motor Type",
                    "description": "dynamixel (Dynamixel AX-series servos), simpleserial (Sabertooth and Cytron motor controllers), virtual (virtual motor connection for testing without motors).",
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
                                "simpleserial"
                            ]
                        }
                    }
                },
                "baudrate": {
                    "$id": "#/properties/motors/properties/baudrate",
                    "type": "integer",
                    "title": "Serial Baud Rate",
                    "description": "Baud rate of the serial port. Some common values include 1000000 for dynamixel or 9600 for simpleserial.",
                    "default": 1000000,
                    "options": {
                        "dependencies": {
                            "type": [
                                "dynamixel",
                                "simpleserial"
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
                },
                "channels": {
                    "$id": "#/properties/motors/properties/channels",
                    "type": "object",
                    "title": "Motor Channels",
                    "description": "Configure simpleserial motor controller channel assignment for left or right. 'Left' and 'right' groups define which channels control motors on the left and right side. For servo controllers with more than 2 channels, multiple channels can be added to each group.",
                    "options": {
                        "dependencies": {
                            "type": "simpleserial"
                        }
                    },
                    "required": [
                        "left",
                        "right"
                    ],
                    "properties": {
                        "left": {
                            "$id": "#/properties/motors/properties/channels/properties/left",
                            "type": "array",
                            "format": "table",
                            "title": "Left Motor Channel Array",
                            "description": "The motor controller channel/s used for motors on the left of the robot.",
                            "items": {
                                "$id": "#/properties/motors/properties/channels/properties/left/items",
                                "type": "integer",
                                "title": "Left Motor Channel",
                                "description": "An integer representing a channel used by motors on the left side of the robot."
                            }
                        },
                        "right": {
                            "$id": "#/properties/motors/properties/channels/properties/right",
                            "type": "array",
                            "format": "table",
                            "title": "Right Motor Channel Array",
                            "description": "The motor controller channel/s used for motors on the right of the robot.",
                            "items": {
                                "$id": "#/properties/motors/properties/channels/properties/right/items",
                                "type": "integer",
                                "title": "Right Motor Channel",
                                "description": "An integer representing a channel used by motors on the right side of the robot."
                            }
                        }
                    }
                }
            }
        },
        "arm": {
            "$id": "#/properties/arm",
            "type": "object",
            "options": {
                "collapsed": true
            },
            "title": "Arm",
            "description": "Arm settings",
            "required": [
                "enabled"
            ],
            "properties": {
                "enabled": {
                    "$id": "#/properties/arm/properties/enabled",
                    "type": "boolean",
                    "title": "Enabled",
                    "description": "Whether the arm is enabled",
                    "format": "checkbox",
                    "default": false
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
                                        "description": "Element to append the graph to.  Try '#btm_view_sensors', '#left_view_sensors' or '#right_view_sensors'.",
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
                                        "default": "chart-line"
                                    },
                                    "colour_scheme": {
                                        "type": "string",
                                        "title": "Colour Scheme",
                                        "description": "The colour scheme to use for graph lines. Other colours will be used if more are required.",
                                        "enum": [
                                            "summer",
                                            "ocean",
                                            "magic"
                                        ],
                                        "default": "summer"
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
                                        "description": "Element to append the graph to.  Try '#btm_view_sensors', '#left_view_sensors' or '#right_view_sensors'.",
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
                                        "required": false,
                                        "default": null,
                                        "description": "(Optional) The maximum value that the sensor can report, used when calculating how full the circle bar should be. Most sensors, especially the host resource monitors (CPU, disk and RAM usage as well as CPU temperature) can auto-report their correct maximum value, meaning you should leave this blank unless you need to reduce your sensor's maximum value."
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
                                        "description": "Element to append the text box to. Recommended to append to a list-group element. Try '#textgroup_left' or '#textgroup_right'.",
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
                                "title": "Uptime Box",
                                "properties": {
                                    "uid": {
                                        "type": "string",
                                        "title": "Unique ID",
                                        "description": "The UID used to identify the uptime text box."
                                    },
                                    "type": {
                                        "type": "string",
                                        "title": "Type",
                                        "description": "The type of graph to use.",
                                        "enum": [
                                            "uptime"
                                        ],
                                        "default": "uptime",
                                        "format": "radio"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Enable",
                                        "description": "Whether the uptime text box is enabled.",
                                        "format": "checkbox",
                                        "default": true
                                    },
                                    "location": {
                                        "type": "string",
                                        "title": "Location",
                                        "description": "Element to append the uptime text box to. Recommended to append to a list-group element. Try '#textgroup_left' or '#textgroup_right'.",
                                        "default": "#"
                                    },
                                    "title": {
                                        "type": "string",
                                        "title": "Title",
                                        "description": "Title displayed on the uptime text box.",
                                        "default": "Uptime"
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
                                        "description": "Element to append the graph to. Try '#btm_view_sensors', '#left_view_sensors' or '#right_view_sensors'.",
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
                                        "description": "Sets the default opacity (0 - 100%) of the thermal camera when overlaid (optional).",
                                        "format": "range",
                                        "default": 25,
                                        "minimum": 0,
                                        "maximum": 100
                                    },
                                    "xscale": {
                                        "type": "integer",
                                        "title": "Default Thermal Camera X Scale",
                                        "required": false,
                                        "description": "Sets the default x scale (50 - 150%) of the thermal camera when overlaid (optional).",
                                        "format": "range",
                                        "default": 100,
                                        "minimum": 50,
                                        "maximum": 150
                                    },
                                    "yscale": {
                                        "type": "integer",
                                        "title": "Default Thermal Camera Y Scale",
                                        "required": false,
                                        "description": "Sets the default y scale (50 - 150%) of the thermal camera when overlaid (optional).",
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
                "theme": {
                    "$id": "#/properties/interface/properties/theme",
                    "type": "object",
                    "options": {
                        "collapsed": true
                    },
                    "title": "Theme",
                    "description": "Customise the appearance of the SIGHTS interface.",
                    "required": [
                        "accent_colour"
                    ],
                    "properties": {
                        "accent_colour": {
                            "$id": "#/properties/interface/properties/theme/properties/accent_colour",
                            "type": "string",
                            "format": "color",
                            "title": "Accent Colour",
                            "description": "Enter the hexadecimal colour code of the desired accent colour",
                            "default": '#FF5A00'
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
                                "type": "object",
                                "title": "Display On",
                                "description": "The SGP30 sensor is a multi-sensor. Choose how each value is displayed individually.",
                                "options": {
                                    "collapsed": false
                                },
                                "properties": {
                                    "co2": {
                                        "type": "array",
                                        "title": "Carbon Dioxide",
                                        "description": "A list of graph UIDs to display this sensor's carbon dioxide data on.",
                                        "items": {
                                            "type": "string",
                                            "title": "Graph UID"
                                        }
                                    },
                                    "tvoc": {
                                        "type": "array",
                                        "title": "Total Volatile Organic Compounds",
                                        "description": "A list of graph UIDs to display this sensor's total volatile organic compound data on.",
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
                            "address": {
                                "type": "string",
                                "title": "I2C Address",
                                "description": "The I2C Address for the AMG8833 thermal camera",
                                "default": "0x69"
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
                        "title": "MLX90640 (Thermal Camera)",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the MLX90640 thermal camera is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "mlx90640"
                                ],
                                "default": "mlx90640",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the MLX90640 thermal camera.",
                                "default": "New Sensor"
                            },
                            "address": {
                                "type": "string",
                                "title": "I2C Address",
                                "description": "The I2C Address for the MLX90640 thermal camera",
                                "default": "0x33"
                            },
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, frames are pulled from the MLX90460 thermal camera.",
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
                        "title": "MLX90641 (Thermal Camera)",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the MLX90641 thermal camera is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "mlx90641"
                                ],
                                "default": "mlx90641",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the MLX90641 thermal camera.",
                                "default": "New Sensor"
                            },
                            "address": {
                                "type": "string",
                                "title": "I2C Address",
                                "description": "The I2C Address for the MLX90641 thermal camera",
                                "default": "0x33"
                            },
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, frames are pulled from the MLX90461 thermal camera.",
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
                        "title": "Host CPU Usage Monitor",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the CPU usage monitor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "cpu_usage"
                                ],
                                "default": "cpu_usage",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the CPU usage monitor.",
                                "default": "New Sensor"
                            },
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the CPU usage monitor updates.",
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
                        "title": "Host Disk Usage Monitor",
                        "options": {
                            "collapsed": true
                        },
                        "properties": {
                            "enabled": {
                                "type": "boolean",
                                "title": "Enable",
                                "description": "Whether the disk usage monitor is enabled",
                                "format": "checkbox",
                                "default": true
                            },
                            "type": {
                                "type": "string",
                                "title": "Type",
                                "enum": [
                                    "disk_usage"
                                ],
                                "default": "disk_usage",
                                "format": "radio"
                            },
                            "name": {
                                "type": "string",
                                "title": "Name",
                                "description": "The pretty name for the disk usage monitor.",
                                "default": "New Sensor"
                            },
                            "precision": {
                                "type": "integer",
                                "title": "Precision",
                                "description": "The number of decimal places to round to.",
                                "default": 2
                            },
                            "period": {
                                "type": "number",
                                "title": "Update Period",
                                "description": "How often, in seconds, the disk usage monitor updates.",
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
                            "min_a": {
                                "type": "integer",
                                "title": "Minimum Value A",
                                "description": "The minimum value of randomly generated data A.",
                                "required": false,
                                "default": null
                            },
                            "max_a": {
                                "type": "integer",
                                "title": "Maximum Value A",
                                "description": "The maximum value of randomly generated data A.",
                                "required": false,
                                "default": null
                            },
                            "min_b": {
                                "type": "integer",
                                "title": "Minimum Value B",
                                "description": "The minimum value of randomly generated data B.",
                                "required": false,
                                "default": null
                            },
                            "max_b": {
                                "type": "integer",
                                "title": "Maximum Value B",
                                "description": "The maximum value of randomly generated data B.",
                                "required": false,
                                "default": null
                            },
                            "min_c": {
                                "type": "integer",
                                "title": "Minimum Value C",
                                "description": "The minimum value of randomly generated data C.",
                                "required": false,
                                "default": null
                            },
                            "max_c": {
                                "type": "integer",
                                "title": "Maximum Value C",
                                "description": "The maximum value of randomly generated data C.",
                                "required": false,
                                "default": null
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
                    "title": "Enable WebSocket Logging",
                    "description": "Log messages between the SIGHTS service and interface.",
                    "format": "checkbox",
                    "default": false
                }
            }
        }
    }
};
