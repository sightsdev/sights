from flask_restx import Api
from sights.restapi.cameras import api as cameras
from sights.restapi.sensors import api as sensors
from sights.restapi.plugins import api as plugins

api = Api(
    title='Sights REST API',
    version='1.0',
    description='An API for clients to interact with the Sights service'
)

api.add_namespace(cameras, path="/api/v1/cameras/")
api.add_namespace(sensors, path="/api/v1/sensors/")
api.add_namespace(plugins, path="/api/v1/plugins/")