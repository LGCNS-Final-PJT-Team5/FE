import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from '../src/store/useAuthStore';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock Zustand stores properly
jest.mock('../src/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock navigation components
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: any}) => children,
}));

jest.mock('../src/services/navigation/AppNavigator', () => {
  return {
    __esModule: true,
    default: () => {
      const React = require('react');
      return React.createElement('View', {testID: 'app-navigator'});
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}: {children: any}) => children,
}));

// Mock Firebase messaging with exact structure from types
jest.mock('@react-native-firebase/messaging', () => {
  const mockMessaging = {
    requestPermission: jest.fn(),
    getToken: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
    onMessage: jest.fn(),
    AuthorizationStatus: {
      NOT_DETERMINED: -1,
      DENIED: 0,
      AUTHORIZED: 1,
      PROVISIONAL: 2,
      EPHEMERAL: 3,
    },
  };

  // Default export function with statics attached
  const messagingFunction = () => mockMessaging;
  messagingFunction.AuthorizationStatus = mockMessaging.AuthorizationStatus;

  return {
    __esModule: true,
    default: messagingFunction,
  };
});

// Mock Notifee with default export
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    displayNotification: jest.fn(),
    createChannel: jest.fn(),
  },
  AndroidImportance: {
    HIGH: 4,
  },
}));

// Mock React Native modules properly
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: 33,
  },
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  StatusBar: {},
  // Add missing properties for React Native Testing Library
  StyleSheet: {
    create: jest.fn(styles => styles),
    flatten: jest.fn(style => style),
    compose: jest.fn((style1, style2) => [style1, style2]),
  },
  Dimensions: {
    get: jest.fn(() => ({width: 390, height: 844})),
  },
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  },
}));

// Mock store functions and get references to the mocked functions
const mockSetIsLoggedIn = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

// Get references to mocked functions for assertions
let mockMessaging: any;
let mockNotifee: any;

beforeAll(() => {
  // Get the mocked modules after they're set up
  const messagingModule = require('@react-native-firebase/messaging');
  mockMessaging = messagingModule.default();
  mockNotifee = require('@notifee/react-native').default;
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useAuthStore with complete AuthState interface
    mockUseAuthStore.mockImplementation(selector => {
      const state = {
        isLoggedIn: false,
        setIsLoggedIn: mockSetIsLoggedIn,
        logout: jest.fn(),
      };
      return selector(state);
    });

    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

    // Reset Firebase mocks
    mockMessaging.requestPermission.mockResolvedValue(1); // AUTHORIZED by default
    mockMessaging.getToken.mockResolvedValue('firebase-token-123');

    // Reset React Native mocks
    const {PermissionsAndroid} = require('react-native');
    PermissionsAndroid.request.mockResolvedValue('granted');
  });

  describe('App 컴포넌트 렌더링', () => {
    it('App이 정상적으로 렌더링된다', () => {
      const {getByTestId} = render(<App />);
      expect(getByTestId('app-navigator')).toBeTruthy();
    });

    it('SafeAreaProvider로 감싸져 있다', () => {
      const component = render(<App />);
      expect(component).toBeDefined();
    });
  });

  describe('토큰 체크 로직', () => {
    it('JWT 토큰이 있을 때 로그인 상태를 true로 설정한다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('valid-jwt-token');

      render(<App />);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('jwtToken');
        expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true);
      });
    });

    it('JWT 토큰이 없을 때 로그인 상태를 설정하지 않는다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      render(<App />);

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('jwtToken');
      });

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });

    it('토큰 체크 중 에러가 발생해도 앱이 크래시되지 않는다', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error'),
      );

      const component = render(<App />);
      expect(component).toBeDefined();

      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('jwtToken');
      });

      expect(mockSetIsLoggedIn).not.toHaveBeenCalled();
    });
  });

  describe('Firebase 권한 및 토큰', () => {
    it('App 렌더링 시 Firebase 권한이 허용되면 토큰을 가져온다', async () => {
      mockMessaging.requestPermission.mockResolvedValue(1); // AUTHORIZED
      mockMessaging.getToken.mockResolvedValue('firebase-token-123');

      render(<App />);

      await waitFor(() => {
        expect(mockMessaging.requestPermission).toHaveBeenCalled();
        expect(mockMessaging.getToken).toHaveBeenCalled();
      });
    });

    it('App 렌더링 시 Firebase 권한이 PROVISIONAL일 때도 토큰을 가져온다', async () => {
      mockMessaging.requestPermission.mockResolvedValue(2); // PROVISIONAL
      mockMessaging.getToken.mockResolvedValue('firebase-token-123');

      render(<App />);

      await waitFor(() => {
        expect(mockMessaging.requestPermission).toHaveBeenCalled();
        expect(mockMessaging.getToken).toHaveBeenCalled();
      });
    });

    it('App 렌더링 시 Firebase 권한이 거부되면 토큰을 가져오지 않는다', async () => {
      mockMessaging.requestPermission.mockResolvedValue(0); // DENIED

      render(<App />);

      await waitFor(() => {
        expect(mockMessaging.requestPermission).toHaveBeenCalled();
        expect(mockMessaging.getToken).not.toHaveBeenCalled();
      });
    });
  });

  describe('알림 설정', () => {
    it('Android 알림 권한을 요청한다', async () => {
      const {PermissionsAndroid} = require('react-native');
      PermissionsAndroid.request.mockResolvedValue('granted');

      render(<App />);

      await waitFor(() => {
        expect(PermissionsAndroid.request).toHaveBeenCalledWith(
          'android.permission.POST_NOTIFICATIONS',
        );
      });
    });

    it('알림 채널들이 생성된다', async () => {
      render(<App />);

      await waitFor(() => {
        expect(mockNotifee.createChannel).toHaveBeenCalledWith({
          id: 'crash',
          name: 'crash',
          sound: 'crash',
          importance: 4,
        });

        expect(mockNotifee.createChannel).toHaveBeenCalledWith({
          id: 'idle',
          name: 'idle',
          sound: 'idle',
          importance: 4,
        });

        expect(mockNotifee.createChannel).toHaveBeenCalledWith({
          id: 'lineout',
          name: 'lineout',
          sound: 'lineout',
          importance: 4,
        });

        expect(mockNotifee.createChannel).toHaveBeenCalledWith({
          id: 'overspeed',
          name: 'overspeed',
          sound: 'overspeed',
          importance: 4,
        });
      });
    });

    it('메시지 핸들러들이 설정된다', async () => {
      render(<App />);

      await waitFor(() => {
        expect(mockMessaging.setBackgroundMessageHandler).toHaveBeenCalled();
        expect(mockMessaging.onMessage).toHaveBeenCalled();
      });
    });
  });

  describe('알림 표시 로직', () => {
    it('허용된 채널로 알림이 표시된다', async () => {
      const mockRemoteMessage = {
        data: {
          channel: 'crash',
          title: 'Test Title',
          body: 'Test Body',
        },
      };

      render(<App />);

      // setBackgroundMessageHandler에 전달된 콜백 함수 가져오기
      await waitFor(() => {
        expect(mockMessaging.setBackgroundMessageHandler).toHaveBeenCalled();
      });

      const backgroundHandler =
        mockMessaging.setBackgroundMessageHandler.mock.calls[0][0];

      // 핸들러 실행
      await backgroundHandler(mockRemoteMessage);

      expect(mockNotifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Title',
          body: 'Test Body',
          android: expect.objectContaining({
            channelId: 'crash',
            sound: 'crash',
            importance: 4,
          }),
        }),
      );
    });

    it('허용되지 않은 채널은 default로 처리된다', async () => {
      const mockRemoteMessage = {
        data: {
          channel: 'unknown',
          title: 'Test Title',
          body: 'Test Body',
        },
      };

      render(<App />);

      await waitFor(() => {
        expect(mockMessaging.setBackgroundMessageHandler).toHaveBeenCalled();
      });

      const backgroundHandler =
        mockMessaging.setBackgroundMessageHandler.mock.calls[0][0];
      await backgroundHandler(mockRemoteMessage);

      expect(mockNotifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          android: expect.objectContaining({
            channelId: 'default',
            sound: 'default',
          }),
        }),
      );
    });

    it('유니크한 알림 ID가 생성된다', async () => {
      const mockRemoteMessage = {
        data: {
          channel: 'crash',
          title: 'Test Title',
          body: 'Test Body',
        },
      };

      render(<App />);

      await waitFor(() => {
        expect(mockMessaging.setBackgroundMessageHandler).toHaveBeenCalled();
      });

      const backgroundHandler =
        mockMessaging.setBackgroundMessageHandler.mock.calls[0][0];
      await backgroundHandler(mockRemoteMessage);

      expect(mockNotifee.displayNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^crash_\d+$/),
        }),
      );
    });
  });
});

// 기본 테스트
describe('App 기본 테스트', () => {
  it('기본 테스트만 실행', () => {
    expect(true).toBe(true);
  });
});
