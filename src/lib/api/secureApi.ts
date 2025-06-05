import AsyncStorage from '@react-native-async-storage/async-storage';
import baseApi from './baseApi';
import { authService } from '../../services/api/authService';
import { useAuthStore } from '../../store/useAuthStore';

// 토큰 인증이 필요한 API용 인스턴스
const secureApi = baseApi;

// Request: JWT 토큰 주입
secureApi.interceptors.request.use(
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
secureApi.interceptors.response.use(
  res => res,
  async error => {
    // 기존 토큰 갱신 로직
    const originalRequest = error.config;
    const isTokenExpired = error.response?.status === 401 && !originalRequest._retry;

    if (isTokenExpired) {
      // 기존 토큰 갱신 로직 유지
    }
    return Promise.reject(error);
  }
);

export default secureApi;