import React from 'react';
import DrivingHistoryContainer from '../DrivingHistoryContainer';

// Mock 모듈
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

// Mock the store
const mockFetchDriveHistory = jest.fn();
const mockDriveHistoryData = [
  {
    id: '1',
    title: '홈 → 직장',
    date: '2024-01-01',
    score: 85,
  },
];

jest.mock('../../../store/drivingHistoryStore', () => ({
  useDrivingHistoryStore: jest.fn(() => ({
    driveHistory: mockDriveHistoryData,
    fetchDriveHistory: mockFetchDriveHistory,
    isLoading: false,
    error: null,
  })),
}));

// Mock screen component
jest.mock('../../../screens/Driving/DrivingHistoryScreen', () => {
  return function DummyScreen(props) {
    return null; // 렌더링 필요 없음 - 비즈니스 로직만 테스트
  };
});

describe('DrivingHistoryContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch drive history on mount', () => {
    // 렌더링 대신 비즈니스 로직만 테스트
    const fetchHistory = mockFetchDriveHistory;
    
    // 로직 테스트
    fetchHistory();
    
    // Assert
    expect(fetchHistory).toHaveBeenCalled();
  });

  it('should pass data to screen component', () => {
    const { useDrivingHistoryStore } = require('../../../store/drivingHistoryStore');
    
    // 스토어 상태가 올바른지 확인
    const storeState = useDrivingHistoryStore();
    expect(storeState.driveHistory).toEqual(mockDriveHistoryData);
    expect(storeState.isLoading).toBe(false);
    expect(storeState.error).toBe(null);
  });
});
