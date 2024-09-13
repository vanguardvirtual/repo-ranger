import endpoints from '@config/endpoints.js';
import apiCall from './apiCall';
import { useMutation } from 'react-query';
import { IRefreshUserResponse, IResponse } from '../types';

interface IRefreshUser {
  id: number;
}

const api = async (data: IRefreshUser): Promise<IResponse<IRefreshUserResponse>> => {
  const { id } = data;

  const response = await apiCall.get<IResponse<IRefreshUserResponse>>(`${endpoints.REFRESH_SCORE}/${id}`);

  return response.data;
};

const useRefreshUser = () => useMutation(['user-create'], api);
export default useRefreshUser;
