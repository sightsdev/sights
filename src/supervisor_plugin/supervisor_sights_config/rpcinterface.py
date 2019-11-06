from supervisor.states import SupervisorStates
from supervisor.xmlrpc import Faults
from supervisor.xmlrpc import RPCError
from os import listdir
from os.path import isfile, join

API_VERSION = '0.2'
ACTIVE_CONFIG_FILE = '/opt/sights/SIGHTSRobot/configs/ACTIVE_CONFIG'
CONFIG_DIR = '/opt/sights/SIGHTSRobot/configs'
CONFIG_EXT = '.json'

class SIGHTSConfigNamespaceRPCInterface:
    """ An extension for Supervisor that implements a basic 
        configuration file handling thing
    """

    def __init__(self, supervisord):
        self.supervisord = supervisord

    def getAPIVersion(self):
        """ Return the version of the RPC API used by this plugin
        @return string  version
        """
        return API_VERSION
    
    def getConfigs(self):
        """ Returns all the available config files
        @return [string]  array of config file names 
        """
        files = [f for f in listdir(CONFIG_DIR) if isfile(join(CONFIG_DIR, f)) and f.endswith(CONFIG_EXT)]
        return files

    def setActiveConfig(self, value):
        """ Sets contents of file
        @return boolean      Always true unless error
        """
        with open(ACTIVE_CONFIG_FILE, 'w') as f:
            f.write(value)
        return True

    def getActiveConfig(self):
        """ Gets contents of file
        @return string      Contents of file
        """
        try:
            with open(ACTIVE_CONFIG_FILE, 'r') as f:
                read_data = f.read()
        except FileNotFoundError:
            read_data = ""
        return read_data

def make_sights_config_rpcinterface(supervisord, **config):
    return SIGHTSConfigNamespaceRPCInterface(supervisord)