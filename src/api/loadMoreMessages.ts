import endpoints from '@config/endpoints';
import { useMutation } from 'react-query';
import apiCall from './apiCall';
import { ChatMessage, IResponse } from '../types';

interface LoadMoreMessagesParams {
  oldestMessageId: number;
}

const api = async ({ oldestMessageId }: LoadMoreMessagesParams): Promise<IResponse<ChatMessage[]>> => {
  const response = await apiCall.get<IResponse<ChatMessage[]>>(`${endpoints.CHAT_MESSAGES}/${oldestMessageId}`);
  return response.data;
};

const useLoadMoreMessages = () => useMutation(['load-more-messages'], api);

export default useLoadMoreMessages;
