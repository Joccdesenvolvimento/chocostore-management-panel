import apiClient from '@/utils/api-client';
import apiAppClient from '@/utils/api-client-apiapp';

const suffixEndpoint = '/orders';

// const baseUrl = "'http://3.128.35.84:3005'";

export default {
  getAll: () => apiClient.get(suffixEndpoint),
  get: id => {
    return apiClient.get(`${suffixEndpoint}/${id}`);
  },
  findHistoricMessages: orderId => {
    return apiClient.get(`${suffixEndpoint}/${orderId}/messages`);
  },
  getMessages: () => apiClient.get(`${suffixEndpoint}/all-messages`),
  getOrdersCancelReasons: () => apiClient.get('/orders-cancel-reasons'),
  getLatest: lastId => apiClient.get(`${suffixEndpoint}/latest/${lastId}`),
  create: data => {
    return apiClient.post(suffixEndpoint, data);
  },
  edit: data => {
    return apiAppClient.put(`${suffixEndpoint}/${data.id}`, data);
  },
  processCashback: data => {
    return apiClient.put(`${suffixEndpoint}/${data.orderId}/cashback`, data);
  }
  // delete: id => {
  //   return apiClient.delete(`/${suffixEndpoint}/${id}`);
  // }
};
