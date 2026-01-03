import axios from 'axios';

const api = axios.create({
  baseURL: 'https://survery-1.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
