import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';

const api = async ({ queryKey }: { queryKey: string[] }) => {
  const [_key, query] = queryKey;
  const response = await apiCall.get(`${endpoints.SEARCH_USERS}?query=${query}`);

  return response.data.usernames;
};

const useGetAllUsers = ({ query }: { query: string }) => useQuery(['get-all-users', query], api);
export default useGetAllUsers;
