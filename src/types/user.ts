export type UserResponse = {
  reward: number;
  nickname: string;
  name: string;
  email: string | null;
  alarm: boolean;
};

export interface LoginWithKakaoRequest {
  accessToken: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  accessToken: string;
  nickname: string;
  drivingExperience: number;
  carNumber: string;
  interest: string;
}