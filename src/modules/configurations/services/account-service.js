import apiClient from '@/utils/api-client';

const suffix = "accounts";

export default {
  get: () => {
    return apiClient.get(`/${suffix}`);
  },
  create: data => {
    return apiClient.post(`/${suffix}`, data);
  },
  destroy: id => {
    return apiClient.delete(`/${suffix}/${id}`);
  }
};
