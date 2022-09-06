import apiClient from '@/utils/api-client';

const suffixEndpoint = '/categories';

export default {
  getAll: () => apiClient.get(suffixEndpoint),
  get: id => {
    return apiClient.get(`${suffixEndpoint}/${id}`);
  },
  create: data => {
    return apiClient.post(suffixEndpoint, data, {
      headers: {
        Accept: 'multipart/form-data',
      }
    });
  },
  edit: data => {
    // const { id: categoryId } = data;

    // delete data["id"];
    return apiClient.put(`${suffixEndpoint}/${data.get("id")}`, data, {
      headers: {
        Accept: 'multipart/form-data',
      }
    });
  },
  delete: id => {
    return apiClient.delete(`${suffixEndpoint}/${id}`);
  }
};
