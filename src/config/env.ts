// 파일이 없다면 새로 생성하세요
import { Platform } from 'react-native';

const env = {
  API_URL: __DEV__ 
    ? (Platform.OS === 'ios'
       ? 'http://192.168.0.241:8080'
       : 'http://192.168.0.241:8080')
    : 'https://api.yourproductionurl.com',
};

export default env;
