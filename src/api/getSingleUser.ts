import endpoints from '@config/endpoints.js';
import { useQuery } from 'react-query';
import apiCall from './apiCall';
import { IResponse, IUser } from '../types';

const api = async ({ queryKey }: { queryKey: string[] }): Promise<IResponse<IUser>> => {
  const [_key, id] = queryKey;
  const response = await apiCall.get<IResponse<IUser>>(`${endpoints.GET_USER_BY_ID}/${id}`);

  return response.data;
};

const useGetSingleUser = ({ id }: { id: string }) => useQuery(['get-single-user', id], api);
export default useGetSingleUser;
