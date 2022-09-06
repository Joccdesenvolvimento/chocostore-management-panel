import apiClient from '@/utils/api-client';
export default {
  getAll: () => {
    return apiClient.get(`/banners`)
  },
  delete: bannerId => {
    return apiClient.delete(`banners/${bannerId}`)
  },
  edit: banner => {
    return apiClient.put(`/banners`, banner, {
      headers: {
        Accept: 'multipart/form-data',
      }
    })
  },
  createBanner: banner => {
    return apiClient.post(`/banners`, banner, {
      headers: {
        Accept: 'multipart/form-data',
      }
    })
  }
};
