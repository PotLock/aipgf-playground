import { SignInDto, SignInResponse, SignUpResponse } from '../interfaces/auth.interface';

import { API_ENDPOINTS } from '@/common/constants/api-endpoint.constant';
import axiosClient from '@/common/http/http-request';

export const signUp = (userDto: { email: string; password: string }) => {
  return axiosClient.post<SignUpResponse>(API_ENDPOINTS.SIGN_UP, userDto); //UserEntity
};

export const signIn = (signInDto: SignInDto) => {
  return axiosClient.post<SignInResponse>(API_ENDPOINTS.SIGN_IN, signInDto);
};

const AuthApi = { signUp, signIn };

export default AuthApi;
