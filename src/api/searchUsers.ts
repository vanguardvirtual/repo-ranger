import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';

const api = async ({ queryKey }: { queryKey: string[] }) => {
  const [_key, query] = queryKey;
  const response = await apiCall.get(`${endpoints.SEARCH_USERS}/${query}`);

  return response.data;
};

const useSearchUser = ({ query }: { query: string }) => useQuery(['search-user', query], api);
export default useSearchUser;
