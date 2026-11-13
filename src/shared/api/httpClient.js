import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});

export default httpClient;
