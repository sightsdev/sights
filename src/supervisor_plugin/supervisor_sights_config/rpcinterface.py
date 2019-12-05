from supervisor.states import SupervisorStates
from supervisor.xmlrpc import Faults
from supervisor.xmlrpc import RPCError
from os import listdir, remove, path
from os.path import isfile, join

API_VERSION = '0.2'
ACTIVE_CONFIG_FILE = '/opt/sights/SIGHTSRobot/configs/ACTIVE_CONFIG'
CONFIG_DIR = '/opt/sights/SIGHTSRobot/configs'
CONFIG_EXT = '.json'
MINIMAL_CONFIG = "/opt/sights/SIGHTSRobot/src/configs/sights/minimal.json"

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
        """ Gets the file name of the active config
        @return string      Contents of ACTIVE_CONFIG_FILE
        """
        try:
            with open(ACTIVE_CONFIG_FILE, 'r') as f:
                read_data = f.read()
        except FileNotFoundError:
            read_data = ""
        return read_data

    def deleteConfig(self, value):
        """ Removes the specified config file
        @return boolean      Always true unless error
        """
        config = CONFIG_DIR + "/" + value
        if path.isfile(config):
            remove(config)
        return True

    def requestConfig(self):
        """ Gets the current config
        @return string       Contents of config file
        """

        # What do you suppose is the best way to get the active config file name here?
        # Duplicates getActiveConfig().
        try:
            with open(ACTIVE_CONFIG_FILE, 'r') as f:
                file_path = CONFIG_DIR + "/" + f.read()
                if not path.isfile(file_path):
                    raise FileNotFoundError()
        except FileNotFoundError:
            # If ACTIVE_CONFIG_FILE could not be read, or active config doesn't exist
            file_path = MINIMAL_CONFIG

        # Now read the active config
        try:
            with open(file_path, 'r') as f:
                read_data = f.read()
        except FileNotFoundError:
            read_data = ""
        return read_data

def make_sights_config_rpcinterface(supervisord, **config):
    return SIGHTSConfigNamespaceRPCInterface(supervisord)