// jest.setup.js
import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// 글로벌 fetch mock
global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
  ok: true
}));

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// React Native 기본 Alert mock
jest.spyOn(require('react-native'), 'Alert', 'get').mockReturnValue({
  alert: jest.fn(),
});

// React Navigation 모킹
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn()
  })),
  useRoute: jest.fn(() => ({
    params: { driveId: '123' }
  })),
  useFocusEffect: jest.fn(callback => callback()),
  useIsFocused: jest.fn(() => true)
}));

// React Native Safe Area Context 모킹
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaView: ({ children }) => children
}));

// React Native Vector Icons 모킹
jest.mock('react-native-vector-icons/Feather', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// React Native Linear Gradient mock
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// React Native Reanimated mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// React Native Gesture Handler mock
jest.mock('react-native-gesture-handler', () => {
  return {
    PanGestureHandler: 'PanGestureHandler',
    State: {
      ACTIVE: 'ACTIVE',
      END: 'END'
    }
  };
});

// Firebase 모킹
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn().mockResolvedValue(true),
    hasPermission: jest.fn().mockResolvedValue(true),
    getToken: jest.fn().mockResolvedValue('mock-token'),
    onMessage: jest.fn(() => () => {}),
    onNotificationOpenedApp: jest.fn(() => () => {}),
    getInitialNotification: jest.fn().mockResolvedValue(null)
  }
}));

// Notifee 모킹
jest.mock('@notifee/react-native', () => {
  return {
    __esModule: true,
    default: {
      createChannel: jest.fn().mockResolvedValue('channel-id'),
      displayNotification: jest.fn().mockResolvedValue(),
      onForegroundEvent: jest.fn(() => () => {}),
      onBackgroundEvent: jest.fn(() => () => {}),
      getInitialNotification: jest.fn().mockResolvedValue(null),
      cancelAllNotifications: jest.fn().mockResolvedValue(),
      cancelNotification: jest.fn().mockResolvedValue(),
      getDisplayedNotifications: jest.fn().mockResolvedValue([]),
      requestPermission: jest.fn().mockResolvedValue({ alert: true, badge: true, sound: true }),
    },
    AndroidImportance: {
      DEFAULT: 3,
      HIGH: 4,
      LOW: 2,
      MAX: 5,
      MIN: 1,
      NONE: 0,
    },
    EventType: {
      DELIVERED: 3,
      DISMISSED: 2,
      PRESS: 1,
      TRIGGER: 0,
    },
  };
});

// React Native 문제가 되는 컴포넌트들만 mock
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// 불필요한 경고 메시지들 숨기기
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('ProgressBarAndroid') ||
     args[0].includes('Clipboard') ||
     args[0].includes('has been extracted from react-native'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Console error/warn을 더 조용하게 (선택사항)
console.error = jest.fn();