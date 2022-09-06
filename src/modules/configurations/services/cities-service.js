import axios from 'axios';

const authToken = window.localStorage.getItem('auth-token');

import baseURL from '../../../utils/base-url';

const api = axios.create({
  baseURL: `${baseURL}/cities`,
  headers: {
    Accept: 'application/json',
    authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
});

const get = () => {
  return api.get('/');
};

export default {
  get
};
