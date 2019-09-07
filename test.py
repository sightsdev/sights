import sys
from ruamel.yaml import YAML

f = open("robot.yaml").read()
config = YAML(typ='safe').load(f)

print(config['arduino']['port'])