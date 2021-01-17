import argparse
import random
import typing

# test service

class RandomService:
    def randomint(self, minimum, maximum):
        return random.randint(minimum, maximum)