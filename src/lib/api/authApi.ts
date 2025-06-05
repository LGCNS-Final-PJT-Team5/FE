import axios from 'axios';
import { API } from '../../config/env';

// 인증 전용 Axios 인스턴스
const authApi = axios.create({
  baseURL: API.AUTH_URL,
  timeout: 10000,
});

export default authApi;