import axios from 'axios';
import { API } from '../../config/env';

// 기본 Axios 인스턴스
const baseApi = axios.create({
  baseURL: API.BASE_URL,
  timeout: 10000,
});

export default baseApi;