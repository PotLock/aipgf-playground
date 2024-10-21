import { Session } from 'next-auth';
// @ts-ignore
import { getCsrfToken, getSession, signOut } from 'next-auth/react';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { createAxiosInstance } from './http-client';
import { RefreshTokenResponse } from '@/modules/auth/interfaces/auth.interface';
import { API_ENDPOINTS } from '../constants/api-endpoint.constant';

const axiosClient = createAxiosInstance();

const handleSignOut = async () => {
  signOut({ redirect: true, callbackUrl: '/' });
  await axiosClient.post<RefreshTokenResponse>(API_ENDPOINTS.SIGN_OUT);
};

const updateSession = async (newSession: Session) => {
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      csrfToken: await getCsrfToken(),
      data: newSession
    })
  });
};

const interceptors = {
  onRequest: async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const headers = config.headers;
    const session = await getSession();

    if (session) headers.Authorization = `Bearer ${session.accessToken}`;

    return config;
  },
  onRequestError: (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
  onResponse: (response: AxiosResponse): AxiosResponse => response,
  onResponseError: async (error: AxiosError): Promise<AxiosError> => {
    const originalConfig = error.config as InternalAxiosRequestConfig & {
      _retry: boolean;
    };
    const shouldCallRefreshToken = error.response && error.response.status === 401 && !originalConfig._retry;

    if (shouldCallRefreshToken) {
      originalConfig._retry = true;

      try {
        const session = await getSession();
        const newTokens = await axiosClient.post<RefreshTokenResponse>(API_ENDPOINTS.REFRESH_TOKEN);

        const newSession = Object.assign({}, session, {
          accessToken: newTokens.data.data.accessToken
        });

        await updateSession(newSession);
        originalConfig.headers.Authorization = `Bearer ${newTokens.data.data.accessToken}`;

        return axiosClient(originalConfig);
      } catch (err) {
        handleSignOut();
      }
    }

    return Promise.reject(error);
  }
};

axiosClient.interceptors.request.use(interceptors.onRequest, interceptors.onRequestError);
axiosClient.interceptors.response.use(interceptors.onResponse, interceptors.onResponseError);

export default axiosClient;
