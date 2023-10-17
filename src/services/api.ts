/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  async config => {

    const accessToken = localStorage.getItem('@token:accessToken');
    console.log("configurando o axios com o token", accessToken)
    if (accessToken) {
      config.headers!.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export default api;

export async function refreshAccessToken() {
  try {
    const credentials = localStorage.getItem('@token:refreshToken');

    if (typeof credentials === 'string') {
      const { data } = await api.put('/users/session', {
        refresh_token: credentials,
      });
      localStorage.setItem('@token:accessToken', data.access_token);
      localStorage.setItem('@token:refreshToken', data.refresh_token);
      return data?.access_token;
    }
  } catch (error) {
    localStorage.clear();
    window.location.href = '/';
  }

  localStorage.clear();
  window.location.href = '/';
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
        error?.response?.status === 401 &&
        !originalRequest.retry &&
        originalRequest.url !== '/user/session'
      ) {
      originalRequest.retry = true;
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);
