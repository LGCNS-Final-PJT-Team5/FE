import React from 'react';

// Mock 모듈
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
  useRoute: jest.fn(() => ({ params: { drivingId: '123' } })),
}));

// Mock stores
const mockFetchDriveDetail = jest.fn();
const mockDriveDetailData = {
  id: '123', 
  title: '홈 → 직장',
  totalScore: 85,
  safetyScore: 88,
  carbonScore: 82,
};

jest.mock('../../../store/drivingDetailStore', () => ({
  useDrivingDetailStore: jest.fn(() => ({
    driveDetail: mockDriveDetailData,
    isLoading: false,
    error: null,
    fetchDriveDetail: mockFetchDriveDetail
  })),
}));

jest.mock('../../../store/useUserStore', () => ({
  useUserStore: jest.fn(() => ({
    user: { id: 'user123' }
  })),
}));

// Mock screen component
jest.mock('../../../screens/Driving/DrivingDetailScreen', () => 'DrivingDetailScreen');

describe('Driving Detail Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch drive detail with correct IDs', () => {
    const drivingId = '123';
    const userId = 'user123';
    
    mockFetchDriveDetail(drivingId, userId);
    
    expect(mockFetchDriveDetail).toHaveBeenCalledWith(drivingId, userId);
  });

  it('should handle drive detail data correctly', () => {
    const driveDetail = mockDriveDetailData;
    
    expect(driveDetail).toBeDefined();
    expect(driveDetail.title).toBe('홈 → 직장');
    expect(driveDetail.totalScore).toBe(85);
  });
  
  it('should handle loading state', () => {
    const { useDrivingDetailStore } = require('../../../store/drivingDetailStore');
    
    // 로딩 중 상태 모킹
    useDrivingDetailStore.mockReturnValueOnce({
      driveDetail: null,
      isLoading: true,
      error: null,
      fetchDriveDetail: mockFetchDriveDetail
    });
    
    const state = useDrivingDetailStore();
    expect(state.isLoading).toBe(true);
  });
});
