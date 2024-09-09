import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';

const api = async ({ queryKey }: { queryKey: string[] }) => {
  const [_key] = queryKey;
  const response = await apiCall.get(`${endpoints.GET_ALL_USERS}`);

  return response.data.usernames;
};

const useGetAllUsers = () => useQuery(['get-all-users'], api);
export default useGetAllUsers;
