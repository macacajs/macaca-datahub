"""DataHubSDK."""

import json
import urllib
import urllib2
import logging

LOGGER = logging.getLogger(__name__)

class DataHubSDK(object):
    """DataHubSDK."""

    def __init__(self, protocol='http', hostname='127.0.0.1', port='5678'):
        """Initialize the DataHubSDK."""
        self.root_url = '{0}://{1}:{2}'.format(protocol, hostname, port)

    def update_by_projectid_and_dataid(self, project_id, data_id, data):
        """update by projectid and dataid."""
        LOGGER.debug(project_id, data_id, data)
        res = self.get_by_projectid_and_dataid(project_id, data_id)
        if not res['success']:
            return 'error'

        url = '{0}/api/data/{1}/{2}'.format(self.root_url, project_id, data_id)
        LOGGER.debug(url, data)

        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        req = urllib2.Request(url, urllib.urlencode(data), headers)
        response = urllib2.urlopen(req)
        res = json.loads(response.read())
        response.close()
        return res

    def get_data_list_by_project_id(self, project_id, data):
        """get data list by projectid."""
        url = '{0}/api/data/{1}'.format(self.root_url, project_id)
        LOGGER.debug(url, data)
        req = urllib2.Request(url)
        response = urllib2.urlopen(req)
        res = json.loads(response.read())
        return res

    def get_by_projectid_and_dataid(self, project_id, data_id):
        """get data by projectid and dataid."""
        url = '{0}/api/data/{1}/{2}'.format(self.root_url, project_id, data_id)
        req = urllib2.Request(url)
        response = urllib2.urlopen(req)
        res = json.loads(response.read())
        response.close()
        return res
