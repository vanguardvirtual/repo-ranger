import axios from 'axios';
import { API_URL } from '@config/endpoints';

const apiCall = axios.create({
  baseURL: API_URL,
});

export const apiCallWithToken = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_ACCESS_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

export default apiCall;
