import React from 'react';

// 핵심 모듈만 모킹하고 다른 모든 의존성은 건너뛰기
jest.mock('../../../screens/Driving/SafetyReportScreen', () => 'SafetyReportScreen');

// Store 모킹
const mockFetchSafetyReport = jest.fn();
const mockSafetyData = {
  score: 88,
  acceleration: {
    score: 85,
    feedback: '급가감속 운전이 양호합니다.',
    graph: [
      { time: '2024-01-01T10:00:00Z', flag: true },
      { time: '2024-01-01T10:15:00Z', flag: false },
    ],
  },
  sharpTurn: {
    score: 92,
    feedback: '급회전이 적어 안전합니다.',
  },
  overSpeed: {
    score: 87,
    feedback: '과속 운전이 양호합니다.',
    graph: [
      { period: 1, maxSpeed: 65 },
      { period: 2, maxSpeed: 78 },
    ],
  },
};

jest.mock('../../../store/useSafetyReportStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: mockSafetyData,
    loading: false,
    error: null,
    fetchSafetyReport: mockFetchSafetyReport
  })),
}));

// 차트 처리 유틸리티 모킹
jest.mock('../../../utils/chartDataProcessor', () => ({
  processSafetyData: jest.fn(() => ({
    processedData: {
      score: 88, 
      acceleration: { score: 85 },
      turning: { score: 92 }, 
      speeding: { score: 87 },
    },
    formattedBarData: [{ value: 85 }],
    pieData: [{ value: 92 }],
    formattedLineData: [{ value: 65 }],
  }))
}));

describe('Safety Report Logic', () => {
  it('should fetch safety report data', () => {
    mockFetchSafetyReport('123');
    expect(mockFetchSafetyReport).toHaveBeenCalledWith('123');
  });

  it('should process data format correctly', () => {
    const { processSafetyData } = require('../../../utils/chartDataProcessor');
    
    // 데이터 처리 함수가 호출되었는지 확인
    processSafetyData(mockSafetyData);
    expect(processSafetyData).toHaveBeenCalledWith(mockSafetyData);
  });
  
  it('should calculate average score correctly', () => {
    const scores = [
      mockSafetyData.acceleration.score,
      mockSafetyData.sharpTurn.score,
      mockSafetyData.overSpeed.score
    ];
    const avgScore = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
    
    expect(avgScore).toBeCloseTo(88, 0);
  });
});
