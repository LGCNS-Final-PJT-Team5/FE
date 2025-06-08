import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import env from '../config/env';

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
      
      // 기본 사용자 ID 추가 (필요시)
      if (!config.headers['X-User-Id']) {
        config.headers['X-User-Id'] = '1';
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

export default api;
