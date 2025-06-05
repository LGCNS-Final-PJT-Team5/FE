module.exports = {
  preset: 'react-native',

  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-native-.*|@react-navigation|@react-navigation/.*|@react-native-async-storage|zustand)/'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.js"
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
  ],
  // 특정 패키지의 변환을 무시하여 DevMenu 오류 방지
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest'
  },
  // Mock 기본 경로 설정
  moduleDirectories: ['node_modules', '__mocks__'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/node_modules/**',
  ],
};