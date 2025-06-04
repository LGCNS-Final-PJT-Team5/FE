// src/lib/authApi.ts
import axios from 'axios';
import {Platform} from 'react-native';

let baseURL = '';

if (Platform.OS === 'ios') {
  baseURL = 'http://localhost:8000';
} else if (Platform.OS === 'android') {
  baseURL = 'http://10.0.2.2:8000';
}

const authApi = axios.create({
  baseURL
});

export default authApi;
