import apiClient from '@/utils/api-client';

const suffixEndpoint = '/variations';

export default {
  getAll: () => apiClient.get(suffixEndpoint),
  get: id => {
    return apiClient.get(`${suffixEndpoint}/${id}`);
  },
  create: data => {
    return apiClient.post(suffixEndpoint, data);
  },
  edit: data => {
    const { id: variationId } = data;
    return apiClient.put(`${suffixEndpoint}/${variationId}`, data);
  },
  delete: id => {
    return apiClient.delete(`${suffixEndpoint}/${id}`);
  }
};
