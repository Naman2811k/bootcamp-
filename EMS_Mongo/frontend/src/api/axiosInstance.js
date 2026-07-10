import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL.replace(/\/+$/, '')}/employees`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
