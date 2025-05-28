import { RegisterRequest, TokenRefreshRequest, TokenRefreshResponse } from '../../types/user';
import authApi from '../../lib/authApi';
class AuthService {
  async kakaoLogin(accessToken: string) {
    const response = await authApi.post('/auth/kakao-login', { accessToken });
    const { code, message, data } = response.data;

    if (code === 200) {
      return { type: 'login', data };
    } else if (code === 204) {
      return { type: 'register', message };
    } else {
      throw new Error(message || '로그인 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  async register(payload: RegisterRequest) {
    const response = await authApi.post('/auth/register', payload);
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