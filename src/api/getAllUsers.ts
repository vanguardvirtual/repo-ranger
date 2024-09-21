import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';
import { IResponse, IUser } from '../types';

const api = async ({ queryKey }: { queryKey: string[] }): Promise<IResponse<IUser[]>> => {
  const [_key, query] = queryKey;
  const response = await apiCall.get<IResponse<IUser[]>>(`${endpoints.SEARCH_USERS}?query=${query}&withTrending=true`);

  return response.data;
};

const useGetAllUsers = ({ query }: { query: string }) => useQuery(['get-all-users', query], api);
export default useGetAllUsers;
