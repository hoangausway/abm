import axios from 'axios';

import { BASE_URL, REFRESH_TOKEN_URL, EXPIRE_TOKEN_CODE } from '../config/configs';

const baseConfig = {
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', 'crossDomain': true },
  crossDomain: true
};

export const createPublicAxios = () => axios.create(baseConfig);

export const createPrivateAxios = ({ accessToken, refreshToken }) => {
  const PrivateAxios = axios.create({ ...baseConfig, withCredentials: true });

  PrivateAxios.interceptors.request.use(
    config => {
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  PrivateAxios.interceptors.response.use(
    response => response,
    async (error) => {
      const prevRequest = error?.config;
      if (!prevRequest?.sent && error?.response?.status === EXPIRE_TOKEN_CODE) {
        prevRequest.sent = true;
        const data = await axios.post(REFRESH_TOKEN_URL, { refreshToken });
        prevRequest.headers['Authorization'] = `Bearer ${data?.accessToken}`;
        return PrivateAxios(prevRequest);
      }
      return Promise.reject(error);
    }
  );
  return PrivateAxios;
};


