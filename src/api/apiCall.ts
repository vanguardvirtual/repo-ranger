import axios from 'axios';
import { API_URL } from '@config/endpoints';

const apiCall = axios.create({
  baseURL: API_URL,
});

export default apiCall;
