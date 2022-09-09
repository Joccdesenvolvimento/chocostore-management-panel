import apiClient from '@/utils/api-client';

const panelSuffixEndpoint = '/users-management-panel';
const customerSuffixEndpoint = '/customers-management-panel';

export default {
  //User
  getAll: () => apiClient.get(panelSuffixEndpoint),
  create: data => {
    return apiClient.post(`${panelSuffixEndpoint}/`, data);
  },
  delete: data => {
    return apiClient.delete(`${panelSuffixEndpoint}/${data.id}`);
  },
  edit: data => {
    return apiClient.put(`${panelSuffixEndpoint}/${data.id}`, data);
  },
  //Customer
  getAllCustomers: () => apiClient.get(customerSuffixEndpoint),
  createCustomer: data => {
    return apiClient.post(`${customerSuffixEndpoint}/`, data);
  },
  deleteCustomer: data => {
    return apiClient.delete(`${customerSuffixEndpoint}/${data.id}`);
  },
  editCustomer: data => {
    return apiClient.put(`${customerSuffixEndpoint}/${data.id}`, data);
  },
};
