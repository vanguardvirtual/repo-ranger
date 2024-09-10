import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';

const api = async () => {
  const response = await apiCall.get(`${endpoints.CHAT_MESSAGES}`);

  return response.data;
};

const useGetLatestMessages = () => useQuery(['get-latest-messages'], api);
export default useGetLatestMessages;
