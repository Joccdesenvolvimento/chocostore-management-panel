import apiClient from '@/utils/api-client';
export default {
  getAll: () => {
    return apiClient.get(`/highlights`)
  },
  delete: highlightId => {
    return apiClient.delete(`highlights/${highlightId}`)
  },
  edit: highlight => {
    return apiClient.put(`/highlights`, highlight, {
      headers: {
        Accept: 'multipart/form-data',
      }
    })
  },
  createHighlight: highlight => {
    return apiClient.post(`/highlights`, highlight, {
      headers: {
        Accept: 'multipart/form-data',
      }
    })
  }
};
