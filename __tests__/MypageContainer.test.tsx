import React from 'react';
import {render, screen, act, waitFor} from '@testing-library/react-native';
import {MypageContainer} from '../src/containers/Mypage/MypageContainer';
import {useUserStore} from '../src/store/useUserStore';
import {useAuthStore} from '../src/store/useAuthStore';
import {useCarStore} from '../src/store/useCarStore';
import {authService} from '../src/services/api/authService';
import {UserResponse} from '../src/types/user';
import {Car} from '../src/types/Mypage';

// Mock dependencies
jest.mock('../src/store/useUserStore');
jest.mock('../src/store/useAuthStore');
jest.mock('../src/store/useCarStore');
jest.mock('../src/services/api/authService');

// Mock MypageScreen (default export)
jest.mock('../src/screens/Mypage/MypageScreen.tsx', () => ({
  __esModule: true,
  default: jest.fn(({nickname, car, navigation, onLogout}) => {
    const {Text, TouchableOpacity} = require('react-native');
    return (
      <>
        <Text testID="nickname">{nickname}</Text>
        <Text testID="car">{car}</Text>
        <TouchableOpacity testID="logout" onPress={onLogout}>
          <Text>로그아웃</Text>
        </TouchableOpacity>
      </>
    );
  }),
}));

const TEST_ID = {
  MYPAGE_SCREEN: 'mypage-screen',
  USER_SECTION: 'user-section',
  USER_NAME: 'user-name',
  USER_NICKNAME: 'user-nickname',
  USER_EMAIL: 'user-email',
  USER_REWARD: 'user-reward',
  ACTION_SECTION: 'action-section',
  EDIT_PROFILE_BUTTON: 'edit-profile-button',
  LOGOUT_BUTTON: 'logout-button',
};

// Mock 데이터
const mockUser: UserResponse = {
  nickname: '마이페이지유저',
  name: '테스트',
  email: 'mypage@example.com',
  alarm: false,
  reward: 500,
};

const mockActiveCar: Car = {
  carId: 1,
  number: '12가3456',
  active: true,
};

// Store mocks
const mockLogout = jest.fn();
const mockFetchCars = jest.fn();

const mockUserStore = {
  user: {
    reward: 100,
    nickname: '홍길동',
    name: '홍길동',
    email: 'hong@test.com',
    alarm: true,
  },
  setUser: jest.fn(),
  clearUser: jest.fn(),
  setAlarm: jest.fn(),
  reset: jest.fn(),
  hasHydrated: true,
  setHasHydrated: jest.fn(),
};
const mockAuthStore = {
  isLoggedIn: true,
  setIsLoggedIn: jest.fn(),
  logout: mockLogout,
};
const mockCarStore = {
  cars: [{carId: 1, number: '12가3456', active: true}],
  activeCar: {carId: 1, number: '12가3456', active: true},
  fetchCars: mockFetchCars,
  deleteCar: jest.fn(),
  setActiveCar: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  (useUserStore as unknown as jest.Mock).mockImplementation(selector =>
    selector(mockUserStore),
  );
  (useAuthStore as unknown as jest.Mock).mockImplementation(selector =>
    selector(mockAuthStore),
  );
  (useCarStore as unknown as jest.Mock).mockImplementation(selector =>
    selector(mockCarStore),
  );
});

describe('MypageContainer', () => {
  it('초기 렌더링 시 사용자 정보를 올바르게 표시해야 합니다.', async () => {
    const mockNavigation = {navigate: jest.fn()};
    render(<MypageContainer navigation={mockNavigation} />);
    const MypageScreenMock =
      require('../src/screens/Mypage/MypageScreen.tsx').default;
    await waitFor(() => expect(MypageScreenMock).toHaveBeenCalled());
    const screenProps =
      MypageScreenMock.mock.calls[MypageScreenMock.mock.calls.length - 1][0];
    expect(screenProps.nickname).toBe('홍길동');
    expect(screenProps.car).toBe('12가3456');
    expect(mockFetchCars).toHaveBeenCalled();
  });

  it('로그아웃 버튼 클릭 시 authStore의 logout 함수를 호출해야 합니다.', async () => {
    const mockNavigation = {navigate: jest.fn()};
    render(<MypageContainer navigation={mockNavigation} />);
    const MypageScreenMock =
      require('../src/screens/Mypage/MypageScreen.tsx').default;
    await waitFor(() => expect(MypageScreenMock).toHaveBeenCalled());
    const screenProps =
      MypageScreenMock.mock.calls[MypageScreenMock.mock.calls.length - 1][0];
    screenProps.onLogout();
    expect(mockLogout).toHaveBeenCalled();
  });

  it('로그아웃 처리 중 에러 발생 시 console.error를 호출해야 합니다.', async () => {
    const mockNavigation = {navigate: jest.fn()};
    mockAuthStore.logout = jest.fn(() => {
      throw new Error('logout error');
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    render(<MypageContainer navigation={mockNavigation} />);
    const MypageScreenMock =
      require('../src/screens/Mypage/MypageScreen.tsx').default;
    await waitFor(() => expect(MypageScreenMock).toHaveBeenCalled());
    const screenProps =
      MypageScreenMock.mock.calls[MypageScreenMock.mock.calls.length - 1][0];
    screenProps.onLogout();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
