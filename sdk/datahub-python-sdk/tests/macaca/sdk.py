#
# Testcase for DataHub
#

import pytest

from macaca import DataHub

def test_datahub():
    print(DataHub)
    datahub = DataHub(hostname='127.0.0.1', port='9200')
    datahub.switch_scene(hub='sample', pathname='test1', data={ 'currentScene': 'scene1' })
    datahub.switch_all_scenes(hub='sample', data={ 'currentScene': 'default' })
