import apiClient from '@/utils/api-client';

const suffixEndpoint = '/products';

export default {
  getAll: () => apiClient.get(suffixEndpoint),
  get: id => {
    return apiClient.get(`${suffixEndpoint}/${id}`);
  },
  create: data => {
    return apiClient.post(suffixEndpoint, data, {
      headers: {
        Accept: 'multipart/form-data'
      }
    });
  },
  createArrayProducts: products => {
    return apiClient.post(`${suffixEndpoint}/array`, { products });
  },
  edit: data => {
    for (const value of data.values()) {
      console.log(value);
    }
    return apiClient.put(`${suffixEndpoint}/${data.get('id')}`, data, {
      headers: {
        Accept: 'multipart/form-data'
      }
    });
  },
  updateStock: product => {
    return apiClient.put(
      `${suffixEndpoint}/${product.get('id')}/set-stock/`,
      product,
      {
        headers: {
          Accept: 'multipart/form-data'
        }
      }
    );
  },
  delete: id => {
    return apiClient.delete(`${suffixEndpoint}/${id}`);
  }
};
