import endpoints from '@config/endpoints';
import { useMutation } from 'react-query';
import apiCall from './apiCall';
import { ICreateUser, ICreateUserResponse } from '../types';

const api = async (data: ICreateUser): Promise<ICreateUserResponse> => {
  const { username } = data;

  const dataForm = {
    username,
  };

  const response = await apiCall.post(`${endpoints.CREATE_USER}`, dataForm);

  return response.data;
};

const useCreateUser = () => useMutation(['user-create'], api);
export default useCreateUser;
