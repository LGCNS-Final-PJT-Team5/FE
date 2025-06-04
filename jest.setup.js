// 필수 라이브러리 임포트
import 'react-native-gesture-handler/jestSetup';

// Jest 함수들은 전역 스코프에서 사용할 수 없으므로 삭제
// 274번째 줄에 있던 beforeAll 코드를 제거

// 글로벌 mocks 설정
global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
  ok: true
}));

// React Native 모킹 - requireActual 사용하지 않음
jest.mock('react-native', () => {
  return {
    Platform: { OS: 'ios', select: jest.fn(obj => obj.ios) },
    StyleSheet: { create: jest.fn(styles => styles) },
    Dimensions: { get: jest.fn(() => ({ width: 375, height: 812 })) },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    FlatList: 'FlatList',
    ScrollView: 'ScrollView',
    Image: 'Image',
    TextInput: 'TextInput',
    Modal: 'Modal',
    Pressable: 'Pressable',
    ImageBackground: 'ImageBackground',
    ActivityIndicator: 'ActivityIndicator',
    Alert: { alert: jest.fn() },
    Animated: {
      Value: jest.fn(() => ({
        interpolate: jest.fn(),
        setValue: jest.fn()
      })),
      timing: jest.fn(() => ({ start: jest.fn(cb => cb && cb()) })),
      spring: jest.fn(() => ({ start: jest.fn(cb => cb && cb()) })),
      createAnimatedComponent: jest.fn(comp => comp)
    },
    NativeModules: {
      StatusBarManager: { getHeight: jest.fn() },
      RNGestureHandlerModule: {
        attachGestureHandler: jest.fn(),
        createGestureHandler: jest.fn(),
        dropGestureHandler: jest.fn(),
        updateGestureHandler: jest.fn(),
        State: {},
        Directions: {}
      }
    },
    TurboModuleRegistry: {
      getEnforcing: jest.fn()
    },
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeAllListeners: jest.fn()
    }))
  };
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

// 네이티브 라이브러리 모킹
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

// AsyncStorage 모킹
jest.mock('@react-native-async-storage/async-storage', () => {
  let storage = {};
  return {
    setItem: jest.fn((key, value) => Promise.resolve(null)),
    getItem: jest.fn((key) => Promise.resolve(storage[key] || null)),
    removeItem: jest.fn((key) => Promise.resolve(null)),
    clear: jest.fn(() => Promise.resolve(null)),
    getAllKeys: jest.fn(() => Promise.resolve(Object.keys(storage))),
    multiGet: jest.fn((keys) => Promise.resolve(keys.map(key => [key, storage[key] || null]))),
    multiSet: jest.fn((keyValuePairs) => Promise.resolve(null)),
  };
});

// 추가적인 네이티브 모듈 모킹
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // 여기에 필요한 Reanimated 함수 추가
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => {
  return {
    PanGestureHandler: 'PanGestureHandler',
    State: {
      ACTIVE: 'ACTIVE',
      END: 'END'
    }
  };
});

// Console mocks (선택사항)
console.error = jest.fn();
console.warn = jest.fn();

// React hooks 모킹
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useState: jest.fn().mockImplementation(initialValue => [initialValue, jest.fn()]),
    useEffect: jest.fn().mockImplementation(fn => fn()),
    useContext: jest.fn(),
    useRef: jest.fn().mockReturnValue({ current: null }),
    useCallback: jest.fn().mockImplementation((fn) => fn),
    useMemo: jest.fn().mockImplementation((fn) => fn()),
  };
});