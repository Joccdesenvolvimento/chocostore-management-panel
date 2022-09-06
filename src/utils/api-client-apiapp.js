import axios from 'axios';

const companyId = window.localStorage.getItem('companyId');

const authToken = window.localStorage.getItem('auth-token');

import baseURL from './base-url-apiapp';

const apiClient = axios.create({
  baseURL: `${baseURL}/companies/${companyId}`,
  headers: {
    Accept: 'application/json',
    authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  }
});

apiClient.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      return (window.location.href = '/login');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
