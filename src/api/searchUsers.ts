import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';
import { IResponse, IUser } from '../types';

const api = async ({ queryKey }: { queryKey: string[] }): Promise<IResponse<IUser[]>> => {
  const [_key, query] = queryKey;
  const response = await apiCall.get<IResponse<IUser[]>>(`${endpoints.SEARCH_USERS}/${query}`);

  return response.data;
};

const useSearchUser = ({ query }: { query: string }) => useQuery(['search-user', query], api);
export default useSearchUser;
