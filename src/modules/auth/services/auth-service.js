import axios from 'axios';

import baseURL from '../../../utils/base-url';

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const login = (email, password) => {
  return api.post('/auth', { email, password });
};

export default {
  login
};
