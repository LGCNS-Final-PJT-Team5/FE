import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 필요한 헤더 추가
    config.headers['X-User-Id'] = '1'; // 사용자 ID 등
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 오류:', error);
    return Promise.reject(error);
  }
);

export default api;