from supervisor.states import SupervisorStates
from supervisor.xmlrpc import Faults
from supervisor.xmlrpc import RPCError
import os

API_VERSION = '0.2'
FILE = '/opt/sart/CONFIG_FILE'

class SetFileNamespaceRPCInterface:
    """ An extension for Supervisor that implements a basic 
        interface to manages data storage to a single file
    """

    def __init__(self, supervisord):
        self.supervisord = supervisord

    def getAPIVersion(self):
        """ Return the version of the RPC API used by this plugin
        @return string  version
        """
        return API_VERSION

    def set(self, value):
        """ Sets contents of file
        @return boolean      Always true unless error
        """
        with open(FILE, 'w') as f:
            f.write(value)
        return True

    def get(self):
        """ Gets contents of file
        @return string      Contents of file
        """
        try:
            with open(FILE, 'r') as f:
                read_data = f.read()
        except FileNotFoundError:
            read_data = ""
        return read_data

def make_setfile_rpcinterface(supervisord, **config):
    return SetFileNamespaceRPCInterface(supervisord)