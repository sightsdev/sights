import flask_restx
from sights.restapi.motors import restapi as motors
from sights.restapi.cameras import restapi as cameras
from sights.restapi.sensors import restapi as sensors
from sights.restapi.plugins import restapi as plugins

api = flask_restx.Api(
    title='Sights REST API',
    version='1.0',
    description='An API for clients to interact with the Sights service'
)

custom_api = Namespace('custom', description='Plugin-defined endpoints')

api.add_namespace(motors, path="/api/v1/motors")
api.add_namespace(cameras, path="/api/v1/cameras")
api.add_namespace(sensors, path="/api/v1/sensors")
api.add_namespace(plugins, path="/api/v1/plugins")
api.add_namespace(custom_api, path="/api/v1/custom")