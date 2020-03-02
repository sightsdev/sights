from supervisor.states import SupervisorStates
from supervisor.xmlrpc import Faults
from supervisor.xmlrpc import RPCError
from os import listdir, remove, path, rename, system
from os.path import isfile, getmtime
import subprocess
import sys
import datetime

API_VERSION = '0.2'
ACTIVE_CONFIG_FILE = '/opt/sights/configs/ACTIVE_CONFIG'
CONFIG_DIR = '/opt/sights/configs/'
BACKUP_DIR = '/opt/sights/src/configs/sights/backup/'
CONFIG_EXT = '.json'
MINIMAL_CONFIG = "/opt/sights/src/configs/sights/minimal.json"

def _runCommand(f, command):
    # Run the passed command
    process = subprocess.Popen(command, stdout=subprocess.PIPE)
    while True:
        line = process.stdout.readline().decode('utf-8')
        if not line:
            break
        # Write every line to the log
        sys.stdout.write(line)
        f.write(line)
    # Ensure process has finished
    process.wait()
    # Log result of command
    f.write(f"Process returned: {process.returncode}\n")
    # Return the return code
    return process.returncode

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
        files = [f for f in listdir(CONFIG_DIR) if isfile(CONFIG_DIR + f) and f.endswith(CONFIG_EXT)]
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
        config = CONFIG_DIR + value
        if path.isfile(config):
            remove(config)
        return True

    def requestConfig(self):
        """ Gets the current config
        @return string       Contents of config file
        """
        try:
            with open(ACTIVE_CONFIG_FILE, 'r') as f:
                file_path = CONFIG_DIR + f.read()
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
        config_path = CONFIG_DIR + name

        if path.exists(config_path):
            # File exists
            # Find existing backups for this config file
            for file in sorted(listdir(BACKUP_DIR), reverse=True):
                if file.startswith(f"{name}.backup."):
                    # Get backup ID
                    backup_id = int(file[-1])
                    # Remove oldest backup
                    if backup_id == 9:
                        remove(BACKUP_DIR + file)
                    else:
                        # Add 1 to the rest of the backup IDs
                        new_id = str(backup_id + 1)
                        rename(BACKUP_DIR + file, BACKUP_DIR + name + ".backup." + new_id)
            # Save the previous config as a new backup
            rename(config_path, BACKUP_DIR + name + ".backup.0")

            # Save new config to file
            with open(config_path, 'w') as f:
                f.write(value)
            # self.logger.info("Saved existing configuration file " + config_path)
        else:
            # File does not exist, save new config to file
            with open(config_path, 'w') as f:
                f.write(value)
            # self.logger.info("Saved new configuration file " + config_path)
        return True

    def getRevisions(self, name):
        """ Gets a lost of all revisions of a specified config file
        @return string       A list of revisions and timestamps sorted by most recent
        """
        files = [f for f in listdir(BACKUP_DIR) if isfile(BACKUP_DIR + f) and f.startswith(name + ".backup")]
        revisions = []
        for f in files:
            revisions.append((f, getmtime(BACKUP_DIR + f)))  # File name and unix timestamp (modified time)
        return sorted(revisions)

    def requestRevision(self, name):
        """ Gets the specified revision of a config
        @return string       Contents of config revision file
        """
        try:
            with open(BACKUP_DIR + name, 'r') as f:
                read_data = f.read()
        except FileNotFoundError:
            read_data = ""
        return read_data

    def deleteRevision(self, name):
        """ Removes the specified config revision
        @return boolean      Always true unless error
        """
        revision = BACKUP_DIR + name
        if path.isfile(revision):
            remove(revision)
        return True

    # Handle power commands
    def reboot(self):
        system('reboot')
        return True

    def poweroff(self):
        system('poweroff')
        return True

    def update(self):
        update_commands = [
            ["wget", "https://raw.githubusercontent.com/SFXRescue/sights/master/install.sh", "-O", "/tmp/sights.install.sh"],
            ["chmod", "+x", "/tmp/sights.install.sh"],
            ["/tmp/sights.install.sh", "--update", "--internal"]
        ]
        with open('test.log', 'w') as f:
            f.write(f"Update log for SIGHTS on {datetime.datetime.now()}\n")
            for command in update_commands:
                f.write('> ' + ''.join(e + " " for e in command))
                if _runCommand(f, command) != 0:
                    f.write("\nUpdate failed.")
                    return False
            f.write("\nSIGHTS update succeeded!")
        return True

def make_sights_config_rpcinterface(supervisord, **config):
    return SIGHTSConfigNamespaceRPCInterface(supervisord)