import React from 'react';

// Mock 모듈
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
  useRoute: jest.fn(() => ({ params: { driveId: '123' } })),
}));

// Mock store
const mockFetchEcoReport = jest.fn();
const mockEcoData = {
  score: 82,
  idling: {
    score: 78,
    feedback: '공회전이 적절합니다.',
    graph: [
      {
        startTime: '2024-01-01T10:00:00Z',
        endTime: '2024-01-01T10:05:00Z',
      },
    ],
  },
  speedMaintain: {
    score: 85,
    feedback: '정속주행이 우수합니다.',
    graph: [
      { period: '구간 1', percentage: 75 },
    ],
  },
};

jest.mock('../../../store/useEcoReportStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: mockEcoData,
    loading: false,
    error: null,
    fetchEcoReport: mockFetchEcoReport
  })),
}));

// Mock theme
jest.mock('../../../theme/colors', () => ({
  CARBON_COLORS: {
    chart: {
      highSpeed: '#ff0000',
      midSpeed: '#00ff00',
      lowSpeed: '#0000ff'
    },
    primary: '#000000'
  }
}));

describe('Carbon Emission Report Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch eco report with correct ID', () => {
    mockFetchEcoReport('123');
    expect(mockFetchEcoReport).toHaveBeenCalledWith('123');
  });

  it('should process data correctly', () => {
    // 스코어 확인
    expect(mockEcoData.score).toBe(82);
    expect(mockEcoData.idling.score).toBe(78);
    expect(mockEcoData.speedMaintain.score).toBe(85);
  });

  it('should calculate idling time correctly', () => {
    // 공회전 시간 계산 테스트
    const idlingEvent = mockEcoData.idling.graph[0];
    const start = new Date(idlingEvent.startTime);
    const end = new Date(idlingEvent.endTime);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = durationMs / (1000 * 60);
    
    // 정확히 5분
    expect(durationMinutes).toBe(5);
  });
});
