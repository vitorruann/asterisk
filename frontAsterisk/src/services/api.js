import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.1.31.92:3334',
});

export default api;