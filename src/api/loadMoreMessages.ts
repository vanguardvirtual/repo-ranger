import endpoints from '@config/endpoints';
import { useMutation } from 'react-query';
import apiCall from './apiCall';
import { ChatMessage } from '../types';

interface LoadMoreMessagesParams {
  oldestMessageId: number;
}

interface LoadMoreMessagesResponse {
  messages: ChatMessage[];
}

const api = async ({ oldestMessageId }: LoadMoreMessagesParams): Promise<LoadMoreMessagesResponse> => {
  const response = await apiCall.get(`${endpoints.CHAT_MESSAGES}/${oldestMessageId}`);
  return response.data;
};

const useLoadMoreMessages = () => useMutation(['load-more-messages'], api);

export default useLoadMoreMessages;
