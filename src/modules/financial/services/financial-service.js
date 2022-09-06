import apiClient from '@/utils/api-client';

export default {
  generateFinancialReport: () => {
    return apiClient.get('/generate-financial-report');
  },
  createRequest: (data = {}) => {
    return apiClient.post('/withdrawal-request', data)
  }
};
