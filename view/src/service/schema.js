import request from '../common/request';

export async function getSchema({ interfaceUniqId }) {
  return request(`/api/schema?interfaceUniqId=${interfaceUniqId}`, 'GET');
}

export async function updateSchema({ interfaceUniqId, type, schemaData, enableSchemaValidate }) {
  return request(`/api/schema/${type}`, 'PUT', {
    interfaceUniqId,
    schemaData,
    enableSchemaValidate,
  });
}
