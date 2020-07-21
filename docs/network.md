# Network Ports

This is a list of network ports used by SIGHTS and related services.

## `:22` Secure Shell (SSH)

SSH is enabled on the host to allow access to the underlying OS through the SSH window on the interface. A username and password is required for security.

## `:80` SIGHTS Interface (HTTP)

This is the port that the main SIGHTS interface is hosted on. This will be the page you will see if you visit the host's IP address.

## `:4200` ShellInABox (HTTP)

ShellInABox is a web-based SSH client that is hosted on this port and available through the SSH window on the interface.

## `:5555` SIGHTS control receiver (WebSocket)

`Interface -> Host`

This port is used for sending control messages from the interface to the the host.

The ControlReceiver class on the host listens on this port for messages in the following format (as a JSON string):

```json
{
    type: "TYPE",
    control: "CONTROL",
    value: "VALUE"
}
```

Where `TYPE` can be one of the following, depending on the type of message:

- `KEYBOARD`
- `BUTTON`
- `AXIS`

Typically `CONTROL` will be the name of the control moved (on gamepad or keyboard), or otherwise, the type of system event. For example:

- `DPAD_UP` (a button event)
- `LEFT_STICK_X` (an axis event)
- `FORWARD` (a keyboard event)

Finally `VALUE` will be the actual value of the control:

- `UP` or `DOWN` for button and keyboard event
- A numerical float value for an axis event

## `:5556` SIGHTS sensor stream (WebSocket)

`Host -> Interface`

This port is used for sending sensor data (and also some other data such as config file information) from the host to the interface.

Data sent over this port is in the JSON format. Each key in the JSON data is usually a sensor. For example:

```json
{
    "sensor_data": {
		"memory_1": 7026,
        "cpu_usage_1": 3.2,
        "thermal_camera": [22.5, 22.4, 22.4, 22.3, ...]
	}
}
...
```

## `:8080` Motion web interface (HTTP)

This port is where Motion's main web interface is hosted on. All the active camera streams can be viewed from here, and (if enabled in Motion's config file), settings can be changed.

## `:8081` Motion camera stream (MJPEG)

This port hosts the MJPEG streams. The stream for each camera can be visited at `:8081/<camera_index>`.

This is proxied to `:80/stream` by Apache. So accessing `<robot_ip>/stream` will actually be `:8081` behind the scenes.

## `:9001` Supervisor (HTTP/RPC2)

This is the port that the Supervisor web interface runs on. This can be visited and allows the user to manage the SIGHTS service. Most of the functionality here has been implemented into the SIGHTS interface itself.

This port also runs the XML-RPC API listener on a subdirectory: `/RPC2`. This is proxied to `:80/RPC2` by Apache. So sending messages to `<robot_ip>/RPC2` will actually send them to `:9001/RPC2` behind the scenes.
