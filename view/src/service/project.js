import request from '../common/request';

export async function getProjectList () {
  return request('/api/project', 'GET');
};

export async function getProjectStatisticsList () {
  return request('/api/project/statistics', 'GET');
};

export async function createProject ({ projectName, description, globalProxy }) {
  return request('/api/project', 'POST', {
    projectName,
    description,
    globalProxy,
  });
};

export async function updateProject ({ uniqId, projectName, description, globalProxy }) {
  if (globalProxy) {
    await request('/api/sdk/add_global_proxy', 'POST', {
      projectUniqId: uniqId,
      globalProxy,
    });
  }

  return request(`/api/project/${uniqId}`, 'PUT', {
    projectName,
    description,
    globalProxy,
  });
};

export async function deleteProject ({ uniqId }) {
  return request(`/api/project/${uniqId}`, 'DELETE');
};

export const uploadServer = '/api/project/upload';

export function getDownloadAddress ({ uniqId }) {
  return `/api/project/download/${uniqId}`;
};
