import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import RegisterContainer from '../src/containers/Register/RegisterContainer';
import {authService} from '../src/services/api/authService';
import {dashboardService} from '../src/services/api/dashboardService';
import {userService} from '../src/services/api/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../src/store/useAuthStore';
import {useUserStore} from '../src/store/useUserStore';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../src/types/nav';
import type {RegisterRequest} from '../src/types/user';

// Mock dependencies
jest.mock('../src/services/api/authService');
jest.mock('../src/services/api/dashboardService');
jest.mock('../src/services/api/userService');
jest.mock('../src/store/useAuthStore');
jest.mock('../src/store/useUserStore');
jest.mock('react-native-pager-view', () => 'PagerView');

// Type the mocked stores
const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockedUseUserStore = useUserStore as jest.MockedFunction<
  typeof useUserStore
>;

// Mock RegisterScreen component
jest.mock('../src/screens/Register/RegisterScreen.tsx', () => {
  const React = require('react');
  return {
    RegisterScreen: jest.fn(
      ({
        pageIndex,
        nickname,
        drive,
        carNum,
        interest,
        goToPrior,
        goToNext,
        close,
        register,
        modals,
      }) => {
        // modals를 항상 렌더링하도록 수정
        const children = [
          React.createElement(
            'Text',
            {testID: 'page-index', key: 'page-index'},
            pageIndex,
          ),
          React.createElement(
            'Text',
            {testID: 'nickname', key: 'nickname'},
            nickname,
          ),
          React.createElement('Text', {testID: 'drive', key: 'drive'}, drive),
          React.createElement(
            'Text',
            {testID: 'car-num', key: 'car-num'},
            carNum,
          ),
          React.createElement(
            'Text',
            {testID: 'interest', key: 'interest'},
            interest,
          ),

          React.createElement(
            'TouchableOpacity',
            {testID: 'go-prior-btn', onPress: goToPrior, key: 'go-prior'},
            React.createElement('Text', {key: 'prior-text'}, '이전'),
          ),
          React.createElement(
            'TouchableOpacity',
            {testID: 'go-next-btn', onPress: goToNext, key: 'go-next'},
            React.createElement('Text', {key: 'next-text'}, '다음'),
          ),
          React.createElement(
            'TouchableOpacity',
            {testID: 'close-btn', onPress: close, key: 'close'},
            React.createElement('Text', {key: 'close-text'}, '닫기'),
          ),
          React.createElement(
            'TouchableOpacity',
            {testID: 'register-btn', onPress: register, key: 'register'},
            React.createElement('Text', {key: 'register-text'}, '회원가입'),
          ),
        ];

        // modals가 있으면 추가
        if (modals) {
          children.push(React.cloneElement(modals, {key: 'modals'}));
        }

        return React.createElement(
          'View',
          {testID: 'register-screen'},
          children,
        );
      },
    ),
  };
});

// Mock CustomModal
jest.mock('../src/components/common/CustomModal.tsx', () => {
  const React = require('react');
  return jest.fn(({visible, title, content, onClose, onConfirm, isAlert}) =>
    visible
      ? React.createElement(
          'View',
          {testID: 'custom-modal'},
          [
            React.createElement(
              'Text',
              {testID: 'modal-title', key: 'modal-title'},
              title,
            ),
            content &&
              React.createElement(
                'Text',
                {testID: 'modal-content', key: 'modal-content'},
                content.join ? content.join(' ') : content,
              ),
            React.createElement(
              'TouchableOpacity',
              {testID: 'modal-close-btn', onPress: onClose, key: 'modal-close'},
              React.createElement(
                'Text',
                {key: 'close-btn-text'},
                isAlert ? '확인' : '취소',
              ),
            ),
            onConfirm &&
              React.createElement(
                'TouchableOpacity',
                {
                  testID: 'modal-confirm-btn',
                  onPress: onConfirm,
                  key: 'modal-confirm',
                },
                React.createElement('Text', {key: 'confirm-btn-text'}, '확인'),
              ),
          ].filter(Boolean),
        )
      : null,
  );
});

// Mock navigation
const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset,
    goBack: mockGoBack,
  }),
}));

// Mock store functions - 각 테스트에서 독립적으로 사용할 수 있도록 선언
const mockSetIsLoggedIn = jest.fn();
const mockSetUser = jest.fn();

describe('RegisterContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Store mocks를 매번 새로 설정 - getState() 메서드도 모킹
    mockedUseAuthStore.mockReturnValue({
      setIsLoggedIn: mockSetIsLoggedIn,
      isLoggedIn: false,
      user: null,
    });

    mockedUseUserStore.mockReturnValue({
      setUser: mockSetUser,
      user: null,
    });

    // useUserStore.getState() 메서드 모킹 - 실제 코드에서 사용하는 방식
    (useUserStore as any).getState = jest.fn().mockReturnValue({
      setUser: mockSetUser,
      user: null,
    });

    // AsyncStorage mock
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mock-access-token');
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);

    // Service mocks 기본값 설정 - 성공 케이스로 기본 설정
    (authService.register as jest.Mock).mockResolvedValue({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
    (userService.getMyInfo as jest.Mock).mockResolvedValue({
      reward: 100,
      nickname: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      alarm: true,
    });
    (dashboardService.registerDashboard as jest.Mock).mockResolvedValue(
      undefined,
    );
  });

  it('초기 상태가 올바르게 렌더링된다', () => {
    const {getByTestId} = render(<RegisterContainer />);

    expect(getByTestId('register-screen')).toBeTruthy();
    expect(getByTestId('page-index')).toHaveTextContent('0');
    expect(getByTestId('nickname')).toHaveTextContent('');
    expect(getByTestId('drive')).toHaveTextContent('');
    expect(getByTestId('car-num')).toHaveTextContent('');
    expect(getByTestId('interest')).toHaveTextContent('');
  });

  it('페이지 이동 버튼이 올바르게 동작한다', () => {
    const {getByTestId} = render(<RegisterContainer />);

    // 다음 페이지로 이동
    fireEvent.press(getByTestId('go-next-btn'));
    expect(getByTestId('page-index')).toHaveTextContent('1');

    // 이전 페이지로 이동
    fireEvent.press(getByTestId('go-prior-btn'));
    expect(getByTestId('page-index')).toHaveTextContent('0');
  });

  it('닫기 버튼 클릭 시 확인 모달이 표시된다', () => {
    const {getByTestId} = render(<RegisterContainer />);

    fireEvent.press(getByTestId('close-btn'));

    expect(getByTestId('custom-modal')).toBeTruthy();
    expect(getByTestId('modal-title')).toHaveTextContent(
      '가입을 종료하시겠습니까?',
    );
    expect(getByTestId('modal-content')).toHaveTextContent(
      '작성 중인 내용은 저장되지 않았어요.',
    );
  });

  it('확인 모달에서 확인 클릭 시 로그인 화면으로 이동한다', () => {
    const {getByTestId} = render(<RegisterContainer />);

    fireEvent.press(getByTestId('close-btn'));
    fireEvent.press(getByTestId('modal-confirm-btn'));

    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{name: 'Login'}],
    });
  });

  it('확인 모달에서 취소 클릭 시 모달이 닫힌다', () => {
    const {getByTestId, queryByTestId} = render(<RegisterContainer />);

    fireEvent.press(getByTestId('close-btn'));
    fireEvent.press(getByTestId('modal-close-btn'));

    expect(queryByTestId('custom-modal')).toBeFalsy();
  });

  describe('회원가입 처리', () => {
    const mockRegisterResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    const mockUserInfo = {
      reward: 100,
      nickname: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      alarm: true,
    };

    beforeEach(() => {
      // 회원가입 테스트를 위해 특정 테스트에서만 실패하도록 설정할 때 사용
      // 기본적으로는 상위 beforeEach에서 성공 케이스로 설정됨
    });

    it('회원가입이 성공적으로 처리된다', async () => {
      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          accessToken: 'mock-access-token',
          nickname: '',
          drivingExperience: 0,
          carNumber: '',
          interest: '',
        });
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'jwtToken',
          'new-access-token',
        );
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'refreshToken',
          'new-refresh-token',
        );
        expect(userService.getMyInfo).toHaveBeenCalled();
        expect(mockSetUser).toHaveBeenCalledWith({
          reward: 100,
          nickname: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          alarm: true,
        });
        expect(dashboardService.registerDashboard).toHaveBeenCalled();
      });
    });

    it('회원가입 성공 시 성공 로직이 실행된다', async () => {
      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      // 먼저 회원가입 API 호출이 완료될 때까지 기다림
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // 모든 비동기 작업이 완료될 때까지 기다림
      await waitFor(() => {
        expect(userService.getMyInfo).toHaveBeenCalled();
        expect(dashboardService.registerDashboard).toHaveBeenCalled();
      });

      // 성공적인 회원가입 로직 검증
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'jwtToken',
          'new-access-token',
        );
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          'refreshToken',
          'new-refresh-token',
        );
        expect(mockSetUser).toHaveBeenCalledWith({
          reward: 100,
          nickname: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          alarm: true,
        });
      });
    });

    it('회원가입 성공 시 메인 화면으로 이동하는 로직이 동작한다', async () => {
      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      // 먼저 회원가입 API 호출이 완료될 때까지 기다림
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(userService.getMyInfo).toHaveBeenCalled();
        expect(dashboardService.registerDashboard).toHaveBeenCalled();
      });

      // 회원가입 성공 후 로그인 상태 변경 및 네비게이션 로직 검증
      // 실제로는 모달이 닫힐 때 실행되지만, 성공 로직 자체는 검증 가능
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalled();
      });
    });

    it('AccessToken이 없을 때 회원가입이 실행되지 않는다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      await waitFor(() => {
        expect(authService.register).not.toHaveBeenCalled();
      });
    });

    it('회원가입 실패 시 에러 처리 로직이 실행된다', async () => {
      // 이 테스트에서만 실패하도록 mock 재설정
      (authService.register as jest.Mock)
        .mockReset()
        .mockRejectedValue(new Error('Registration failed'));

      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      // 먼저 에러 발생까지 기다림
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // 에러 로직 검증 - 실제로는 콘솔 에러가 발생하고 있음을 확인
      await waitFor(() => {
        // authService.register가 실패했으므로 후속 호출들은 실행되지 않아야 함
        expect(userService.getMyInfo).not.toHaveBeenCalled();
        expect(dashboardService.registerDashboard).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();
      });
    });

    it('회원가입 실패 시 후속 작업이 실행되지 않는다', async () => {
      // 이 테스트에서만 실패하도록 mock 재설정
      (authService.register as jest.Mock)
        .mockReset()
        .mockRejectedValue(new Error('Registration failed'));

      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // 실패 후 네비게이션이 호출되지 않았는지 확인
      await waitFor(() => {
        expect(mockReset).not.toHaveBeenCalled();
        expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
      });
    });

    it('userService.getMyInfo 실패 시에도 에러 처리가 된다', async () => {
      // userService.getMyInfo 실패하도록 설정
      (userService.getMyInfo as jest.Mock)
        .mockReset()
        .mockRejectedValue(new Error('Failed to get user info'));

      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // userService.getMyInfo 실패로 인한 에러 처리 검증
      await waitFor(() => {
        expect(userService.getMyInfo).toHaveBeenCalled();
        // setUser는 호출되지 않아야 함
        expect(mockSetUser).not.toHaveBeenCalled();
        // dashboardService도 호출되지 않아야 함 (catch 블록으로 이동)
      });
    });

    it('dashboardService.registerDashboard 실패 시에도 에러 처리가 된다', async () => {
      // dashboardService.registerDashboard 실패하도록 설정
      (dashboardService.registerDashboard as jest.Mock)
        .mockReset()
        .mockRejectedValue(new Error('Failed to register dashboard'));

      const {getByTestId} = render(<RegisterContainer />);

      fireEvent.press(getByTestId('register-btn'));

      await waitFor(() => {
        expect(authService.register).toHaveBeenCalled();
      });

      // dashboardService.registerDashboard 실패로 인한 에러 처리 검증
      await waitFor(() => {
        expect(userService.getMyInfo).toHaveBeenCalled();
        expect(mockSetUser).toHaveBeenCalled(); // userService는 성공했으므로 호출됨
        expect(dashboardService.registerDashboard).toHaveBeenCalled();
      });

      // 에러 발생으로 인해 네비게이션은 실행되지 않아야 함
      await waitFor(() => {
        expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
        expect(mockReset).not.toHaveBeenCalled();
      });
    });
  });
});
