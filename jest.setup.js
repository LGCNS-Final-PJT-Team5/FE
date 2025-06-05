// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Alert mock - 더 간단한 방식
jest.spyOn(require('react-native'), 'Alert', 'get').mockReturnValue({
  alert: jest.fn(),
});

// React Native Reanimated mock
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// React Native Vector Icons mock
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

// React Native Linear Gradient mock
jest.mock('react-native-linear-gradient', () => 'LinearGradient');

// React Native 기본 컴포넌트들 중에서 문제가 되는 것들만 mock
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