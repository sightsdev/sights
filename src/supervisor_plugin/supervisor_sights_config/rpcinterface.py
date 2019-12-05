from supervisor.states import SupervisorStates
from supervisor.xmlrpc import Faults
from supervisor.xmlrpc import RPCError
from os import listdir, remove, path, rename
from os.path import isfile, join
from json import dump
import json

API_VERSION = '0.2'
ACTIVE_CONFIG_FILE = '/opt/sights/SIGHTSRobot/configs/ACTIVE_CONFIG'
CONFIG_DIR = '/opt/sights/SIGHTSRobot/configs'
BACKUP_DIR = '/opt/sights/SIGHTSRobot/src/configs/sights/backup/'
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

    def saveConfig(self, value, name):
        """ Saves the received value as a config file
        @return boolean      Always true unless error
        """
        # Rolling backups
        config_path = CONFIG_DIR + "/" + name

        if path.exists(config_path):
            # File exists
            # Find existing backups for this config file
            for file in sorted(listdir(BACKUP_DIR), reverse=True):
                if file.startswith(f"{name}.backup."):
                    # Get backup ID
                    backup_id = int(file[-1])
                    # Remove oldest backup
                    if backup_id == 5:
                        remove(BACKUP_DIR + file)
                    else:
                        # Add 1 to the rest of the backup IDs
                        new_id = str(backup_id + 1)
                        rename(BACKUP_DIR + file, BACKUP_DIR + name + ".backup." + new_id)
            # Save the previous config as a new backup
            rename(config_path, BACKUP_DIR + name + ".backup.0")

            # Save new config to file
            with open(config_path, 'w') as f:
                dump(value, f)
            # self.logger.info("Saved existing configuration file " + config_path)
        else:
            # File does not exist, save new config to file
            with open(config_path, 'w') as f:
                dump(value, f)
            # self.logger.info("Saved new configuration file " + config_path)


def make_sights_config_rpcinterface(supervisord, **config):
    return SIGHTSConfigNamespaceRPCInterface(supervisord)
