import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../config/env';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/api/authService';

const api = axios.create({
  baseURL: env.API.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 요청 인터셉터 설정
api.interceptors.request.use(
  async (config) => {
    try {
      // 토큰 가져오기
      const token = await AsyncStorage.getItem('jwtToken');
      
      // 디버깅용 로그
      console.log(`API 요청: ${config.url}`);
      console.log(`토큰 존재: ${!!token}`);
      
      // 토큰이 존재하면 요청 헤더에 추가
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('API 요청 준비 중 오류:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
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
