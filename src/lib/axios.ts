import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {authService} from '../services/api/authService';
import {useAuthStore} from '../store/useAuthStore'; // 선택

let baseURL = '';

if (Platform.OS === 'ios') {
  baseURL = 'http://localhost:8000';
} else {
  baseURL = 'http://10.0.2.2:8000';
}

const api = axios.create({ baseURL });

// Request: JWT 토큰 주입
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response: 토큰 만료 시 refresh 후 재요청
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    const isTokenExpired = error.response?.status === 401 && !originalRequest._retry;

    if (isTokenExpired) {
      console.log('[interceptor] 토큰 만료 → refresh 시도');

      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await authService.refreshToken({ refreshToken });
        const newAccessToken = res.accessToken;

        await AsyncStorage.setItem('jwtToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', res.refreshToken);
        console.log(' !!! accessToken refresh 성공');

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('refresh 실패:', refreshError);
        useAuthStore.getState().logout?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
