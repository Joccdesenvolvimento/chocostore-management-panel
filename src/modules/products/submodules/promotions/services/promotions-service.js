import apiClient from '@/utils/api-client';

const suffixEndpoint = '/promotions';

export default {
  getAll: () => apiClient.get(suffixEndpoint),
  getBoostHistoric: () => apiClient.get("/boost-historic"),
  get: id => {
    return apiClient.get(`${suffixEndpoint}/${id}`);
  },
  create: data => {
    return apiClient.post(suffixEndpoint, data);
  },
  edit: data => {
    return apiClient.put(`${suffixEndpoint}/${data.id}`, data);
  },
  delete: id => {
    return apiClient.delete(`${suffixEndpoint}/${id}`);
  },
  boostPromotion: data => {
    return apiClient.put(`${suffixEndpoint}/${data.promotionId}/create-boost`, data);
  },
  cancelBoostPromotion: (data) => {
    return apiClient.put(`${suffixEndpoint}/${data.promotionId}/cancel-boost`, data);
  },
};
