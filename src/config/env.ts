import { Platform } from 'react-native';

// 서버 베이스 URL 설정 - Postman에서 사용 중인 형식으로 수정
const BASE_URL = 'http://modive.site'; // 절대 URL 사용

// API 경로 및 엔드포인트 정의
const API = {
  // 기본 URL
  BASE_URL,
  
  // 드라이빙 관련 엔드포인트 - Postman과 일치하도록 수정
  DRIVING: {
    HISTORY: `${BASE_URL}/dashboard/post-drive`,
    DETAIL: (driveId: string) => `${BASE_URL}/dashboard/post-drive/${driveId}`,
    ECO_REPORT: (driveId: string) => `${BASE_URL}/dashboard/post-drive/${driveId}/eco`,
    SAFETY_REPORT: (driveId: string) => `${BASE_URL}/dashboard/post-drive/${driveId}/safe`,
    ATTENTION_REPORT: (driveId: string) => `${BASE_URL}/dashboard/post-drive/${driveId}/attention`,
    PREVENTION_REPORT: (driveId: string) => `${BASE_URL}/dashboard/post-drive/${driveId}/prevention`,
  },
  
  // 추가 API 그룹은 여기에 정의 (예: USER, SETTINGS 등)
};

// 환경 변수 및 API 내보내기
const env = {
  API,
  IS_DEV: __DEV__,
};

export default env;
