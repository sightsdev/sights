import os
import logging
import importlib
import re
import sys
import inspect

# Generic plugin system used for loading motor and sensor wrappers
# Dynamically loads .py files that contain a certain class
class PluginManager:
    def __init__(self, base_class, plugin_dir):
        self.base_class = base_class
        self.plugin_dir = plugin_dir

         # Setup logger
        self.logger = logging.getLogger(__name__)
        
        # Get list of available plugins
        self.plugins = self.get_plugins()
        
        # Create sensor name -> appropriate class lookup table
        self.wrappers = {}

        # Add plugin directory to path to ensure we can import modules from there
        if not self.plugin_dir in sys.path:
            sys.path.insert(0, self.plugin_dir)

        # Load each plugin
        for plugin_name in self.plugins:
            # Import the module
            plugin = importlib.import_module(plugin_name)
            # Iterate through all the available classes for this module and find the class that is the sensor wrapper
            classes = inspect.getmembers(plugin, inspect.isclass)
            class_ = None
            for c in classes:
                # To find the correct class, we check if it's a subclass of SensorWrapper / BaseConnection (and is not that class itself)
                if c[1] != self.base_class and issubclass(c[1], self.base_class):
                    # We've found the sensor wrapper class
                    class_ = c[1]
            # Assign the discovered class to the appropriate key (eg. assign MLX90614Wrapper class to sensors of type 'mlx90614')
            self.wrappers[class_.type_] = class_
            # Log information about enabled plugin
            self.logger.debug(f"Enabling plugin '{plugin_name}' for '{class_.type_}' using class: {class_}")


    def get_plugins(self):
        """Adds plugins to sys.path and returns them as a list"""
        registered_plugins = []
        # Check to see if a plugins directory exists and add any found plugins
        if os.path.exists(self.plugin_dir):
            plugins = os.listdir(self.plugin_dir)
            # Plugins are .py files
            pattern = ".py$"
            for plugin in plugins:
                plugin_path = os.path.join(self.plugin_dir, plugin)
                # Don't load __init__.py as plugin
                if plugin != "__init__.py":
                    if re.search(pattern, plugin):
                        (shortname, ext) = os.path.splitext(plugin)
                        registered_plugins.append(shortname)
                # Search in subdirectories too (one level deep)
                if os.path.isdir(plugin_path):
                    plugins = os.listdir(plugin_path)
                    for plugin in plugins:
                        if plugin != "__init__.py":
                            if re.search(pattern, plugin):
                                (shortname, ext) = os.path.splitext(plugin)
                                sys.path.append(plugin_path)
                                registered_plugins.append(shortname)
        else:
            self.logger.error("Couldn't find sensor plugin directory. SIGHTS is possibly running in wrong working directory.")
        return registered_plugins
    