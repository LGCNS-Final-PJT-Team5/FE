import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import {authService} from '../src/services/api/authService';
import {userService} from '../src/services/api/userService';
import {useUserStore} from '../src/store/useUserStore';
import {useAuthStore} from '../src/store/useAuthStore';
import {SocialLoginContainer} from '../src/containers/Register/SocialLoginContainer';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@react-native-seoul/kakao-login', () => ({
  login: jest.fn(),
}));

jest.mock('../src/services/api/authService', () => ({
  authService: {
    kakaoLogin: jest.fn(),
  },
}));

jest.mock('../src/services/api/userService', () => ({
  userService: {
    getMyInfo: jest.fn(),
  },
}));

// Mock stores with type-safe interfaces
const mockSetUser = jest.fn();
const mockSetIsLoggedIn = jest.fn();

jest.mock('../src/store/useUserStore', () => ({
  useUserStore: {
    getState: jest.fn(() => ({
      setUser: mockSetUser,
      user: null,
      clearUser: jest.fn(),
      setAlarm: jest.fn(),
      reset: jest.fn(),
      hasHydrated: false,
      setHasHydrated: jest.fn(),
    })),
  },
}));

jest.mock('../src/store/useAuthStore', () => ({
  useAuthStore: jest.fn(selector => {
    const mockState = {
      isLoggedIn: false,
      setIsLoggedIn: mockSetIsLoggedIn,
      logout: jest.fn(),
    };
    return selector(mockState);
  }),
}));

// Mock SocialLoginScreen with proper types
jest.mock('../src/screens/Register/SocialLoginScreen', () => {
  const {TouchableOpacity, Text} = require('react-native');
  return jest.fn(({onPressLogin}) => (
    <TouchableOpacity testID="login-button" onPress={onPressLogin}>
      <Text>카카오 로그인</Text>
    </TouchableOpacity>
  ));
});

describe('SocialLoginContainer', () => {
  const mockNavigation = {
    reset: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockKakaoToken = {accessToken: 'kakao_access_token_123'} as any;

  const mockAuthResponse = {
    type: 'login',
    data: {
      accessToken: 'jwt_access_token_123',
      refreshToken: 'jwt_refresh_token_123',
    },
  };

  const mockUserInfo = {
    id: 'user123',
    email: 'test@example.com',
    nickname: '테스트유저',
    name: '홍길동',
    alarm: true,
    reward: 0,
  };

  const mockUseNavigation = useNavigation as jest.MockedFunction<
    typeof useNavigation
  >;
  const mockKakaoLogin = kakaoLogin as jest.MockedFunction<typeof kakaoLogin>;
  const mockAuthService = authService.kakaoLogin as jest.MockedFunction<
    typeof authService.kakaoLogin
  >;
  const mockUserService = userService.getMyInfo as jest.MockedFunction<
    typeof userService.getMyInfo
  >;
  const mockAsyncStorage = AsyncStorage.setItem as jest.MockedFunction<
    typeof AsyncStorage.setItem
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue(mockNavigation);
  });

  describe('컴포넌트 렌더링', () => {
    it('SocialLoginScreen이 정상적으로 렌더링된다', () => {
      const component = render(<SocialLoginContainer />);
      expect(component).toBeDefined();
      expect(component.getByTestId('login-button')).toBeTruthy();
    });
  });

  describe('로그인 로직', () => {
    it('기존 사용자 로그인 시 올바른 순서로 처리된다', async () => {
      mockKakaoLogin.mockResolvedValueOnce(mockKakaoToken);
      mockAuthService.mockResolvedValueOnce(mockAuthResponse);
      mockUserService.mockResolvedValueOnce(mockUserInfo);

      const {getByTestId} = render(<SocialLoginContainer />);
      fireEvent.press(getByTestId('login-button'));

      await waitFor(() => {
        // 카카오 로그인 호출 확인
        expect(mockKakaoLogin).toHaveBeenCalledTimes(1);

        // 토큰 저장 확인
        expect(mockAsyncStorage).toHaveBeenCalledWith(
          'accessToken',
          mockKakaoToken.accessToken,
        );
        expect(mockAsyncStorage).toHaveBeenCalledWith(
          'jwtToken',
          mockAuthResponse.data.accessToken,
        );
        expect(mockAsyncStorage).toHaveBeenCalledWith(
          'refreshToken',
          mockAuthResponse.data.refreshToken,
        );

        // 사용자 정보 저장 확인
        expect(mockSetUser).toHaveBeenCalledWith(mockUserInfo);
        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      });
    });

    it('신규 사용자일 때 회원가입 화면으로 이동한다', async () => {
      const registerResponse = {
        type: 'register',
        data: {
          tempToken: 'temp_token_123',
        },
      };

      mockKakaoLogin.mockResolvedValueOnce(mockKakaoToken);
      mockAuthService.mockResolvedValueOnce(registerResponse);

      const {getByTestId} = render(<SocialLoginContainer />);
      fireEvent.press(getByTestId('login-button'));

      await waitFor(() => {
        expect(mockNavigation.reset).toHaveBeenCalledWith({
          index: 0,
          routes: [{name: 'Register'}],
        });
      });
    });

    it('로그인 실패 시 에러가 적절히 처리된다', async () => {
      const mockError = new Error('Login failed');
      mockKakaoLogin.mockRejectedValueOnce(mockError);

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const {getByTestId} = render(<SocialLoginContainer />);

      fireEvent.press(getByTestId('login-button'));

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          '카카오 로그인 실패',
          mockError,
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
