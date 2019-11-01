#!/usr/bin/env python3
import setuptools

setuptools.setup(
    name = 'supervisor_sart_config',
    version = '0.0.1',
    license = 'License :: OSI Approved :: MIT License',
    url = 'https://github.com/SFXRescue/supervisor_sart_config',
    description = "supervisor_sart_config RPC extension for supervisor. Config file management for SART software",
    classifiers = [
		'Environment :: No Input/Output (Daemon)',
		'Intended Audience :: System Administrators',
		'License :: OSI Approved :: MIT License',
		'Natural Language :: English',
		'Operating System :: POSIX',
		'Programming Language :: Python :: 2',
		'Programming Language :: Python :: 2.6',
		'Programming Language :: Python :: 2.7',
		'Programming Language :: Python :: 3',
		'Programming Language :: Python :: 3.2',
		'Programming Language :: Python :: 3.3',
		'Programming Language :: Python :: 3.4',
		'Topic :: System :: Boot',
		'Topic :: System :: Systems Administration',
    ],
    author='Connor Kneebone',
    author_email='connor@sfxrescue.com',
    packages = setuptools.find_packages(),
    install_requires = ['supervisor >= 3.0a6'],
    namespace_packages = ['supervisor_sart_config']
)