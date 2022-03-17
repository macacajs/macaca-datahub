from setuptools import setup, find_packages
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

with open(path.join(here, 'README.rst'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='datahub-sdk',

    version='1.0.4',

    description='Macaca DataHub Client',
    long_description=long_description,

    url='https://github.com/macacajs/datahub-python-sdk',

    author='xdf',
    author_email='xudafeng@126.com',

    license='MIT',

    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Build Tools',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],

    keywords=[
        'data',
        'management',
        'continues'
    ],

    packages=find_packages(exclude=['tests*', 'docs']),

    install_requires=[
        'enum34',
        'requests',
        'retrying'
    ],

    extras_require={
        'test': ['pytest', 'tox', 'pytest-xdist', 'pytest-cov', 'coverage', 'responses']
    }
)
