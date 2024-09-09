import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';

const api = async ({ queryKey }: { queryKey: string[] }) => {
  const [_key, id] = queryKey;
  const response = await apiCall.get(`${endpoints.REFRESH_SCORE}/${id}`);

  return response.data;
};

const useRefreshUser = ({ id }: { id: string }) => useQuery(['get-refresh-user', id], api);
export default useRefreshUser;
