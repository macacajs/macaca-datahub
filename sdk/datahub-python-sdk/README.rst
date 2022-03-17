DataHub Python Client
=====================

.. image:: https://img.shields.io/coveralls/macacajs/datahub-python-sdk/master.svg
    :target: https://coveralls.io/github/macacajs/datahub-python-sdk

.. image:: https://img.shields.io/travis/macacajs/datahub-python-sdk/master.svg
    :target: https://travis-ci.org/macacajs/datahub-python-sdk

.. image:: https://img.shields.io/pypi/v/datahub-python-sdk.svg
    :target: https://pypi.python.org/pypi/datahub-python-sdk

.. image:: https://img.shields.io/pypi/pyversions/wd.svg
    :target: https://pypi.python.org/pypi/datahub-python-sdk/

.. image:: https://img.shields.io/pypi/dd/datahub-sdk.svg
    :target: https://pypi.python.org/pypi/datahub-sdk/

Intro
-----

datahub-python-sdk is a Python client implemented most of the APIs to control DataHub Service.

Homepage
--------
`datahub-python-sdk’s documentation. <//macacajs.github.io/datahub-python-sdk>`_

Examples
--------

.. code-block:: python

   from macaca import DataHub, DataHubSDK

   datahub = DataHub(hostname = '127.0.0.1', port = '9200')

   datahub.switch_scene(hub='sample', pathname='test1', data={ 'currentScene': 'scene1' })

   datahub.switch_all_scenes(hub='sample', data={ 'currentScene': 'default' })

Changelog
---------
Details changes for each release are documented in the `HISTORY.rst <HISTORY.rst>`_.

Contributing
------------

`See CONTRIBUTING.rst <./CONTRIBUTING.rst>`_

License
-------
`MIT <http://opensource.org/licenses/MIT>`_
