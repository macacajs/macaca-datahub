"""DataHub."""

import logging

from .sdk import DataHubSDK

LOGGER = logging.getLogger(__name__)

class DataHub(object):
    """DataHub."""

    def __init__(self, hostname, port):
        """Initialize DataHub client."""
        self.sdk = DataHubSDK(hostname=hostname, port=port)

    def switch_scene(self, hub, pathname, data):
        """switch scenes."""
        default = {'currentScene': 'default', 'delay': '0', 'status': '200', 'responseHeaders': {}}
        data = dict(default, **data)
        self.sdk.update_by_projectid_and_dataid(project_id=hub, data_id=pathname, data=data)

    def switch_all_scenes(self, hub, data):
        """switch all scenes."""
        LOGGER.debug(hub, data)
        res = self.sdk.get_data_list_by_project_id(project_id=hub, data=data)
        for item in res['data']:
            data_id = item['pathname']
            self.sdk.update_by_projectid_and_dataid(project_id=hub, data_id=data_id, data=data)
