from setuptools import find_packages, setup

setup(
    name="sights",
    description="Sights Robot Control Platform",
    version="2.0.0",
    author="Connor Kneebone",
    author_email="cjkneebone@gmail.com",
    url="https://github.com/sightsdev/sights",
    license='GPL',
    packages=find_packages(exclude=['tests', 'notebooks']),
    namespace_packages=['sights'],
    classifiers=[
        "Programming Language :: Python :: 3",
        'Intended Audience :: Developers',
        "License :: OSI Approved :: GPL License",
        "Operating System :: Unix",
    ],
    keywords='sights',
)