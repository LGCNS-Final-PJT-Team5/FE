import { RegisterRequest, TokenRefreshRequest, TokenRefreshResponse } from '../../types/user';
import authApi from '../../lib/authApi';

class AuthService {
  async kakaoLogin(accessToken: string, fcmToken?: string | null) {
    const requestBody: any = { accessToken };
    
    // FCM 토큰이 있으면 포함
    if (fcmToken) {
      requestBody.fcmToken = fcmToken;
    }
    
    console.log('카카오 로그인 요청 데이터:', requestBody);
    
    const response = await authApi.post('/auth/kakao-login', requestBody);
    const { code, message, data } = response.data;

    if (code === 200) {
      return { type: 'login', data };
    } else if (code === 204) {
      return { type: 'register', message };
    } else {
      throw new Error(message || '로그인 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  async checkDuplicateNickname(nickname: string): Promise<boolean> {
    const response = await authApi.get(`/auth/nickname?search=${nickname}`);
    return response.data.data;
  }

  async register(payload: RegisterRequest, fcmToken?: string) {
    const requestBody = { 
      ...payload,
      fcmToken,
    };

    const response = await authApi.post('/auth/register', requestBody);
    return response.data.data;
  }

  async refreshToken(payload: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    const response = await authApi.post('/auth/refresh', payload);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await authApi.post('/auth/logout');
  }
}

export const authService = new AuthService();