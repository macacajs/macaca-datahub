import request from '../common/request';

export async function getGroupList ({ belongedUniqId, groupType }) {
  return request(`/api/group?belongedUniqId=${belongedUniqId}&groupType=${groupType}`, 'GET');
};

export async function createGroup ({ belongedUniqId, groupName, groupType }) {
  return request('/api/group', 'POST', {
    belongedUniqId,
    groupName,
    groupType,
  });
};

export async function updateGroupName ({ uniqId, groupName }) {
  return request(`/api/group/${uniqId}`, 'PUT', {
    groupName,
  });
};

export async function deleteGroup ({ uniqId }) {
  return request(`/api/group/${uniqId}`, 'DELETE');
};
