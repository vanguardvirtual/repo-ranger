import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';
import { ChatMessage, IResponse } from '../types';

const api = async (): Promise<IResponse<ChatMessage[]>> => {
  const response = await apiCall.get<IResponse<ChatMessage[]>>(`${endpoints.CHAT_MESSAGES}`);

  return response.data;
};

const useGetLatestMessages = () => useQuery(['get-latest-messages'], api);
export default useGetLatestMessages;
