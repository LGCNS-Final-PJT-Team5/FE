import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import SafetyReportContainer from '../SafetyReportContainer';
import useSafetyReportStore from '../../../store/useSafetyReportStore';
import { processSafetyData } from '../../../utils/chartDataProcessor';

// Mock the store
jest.mock('../../../store/useSafetyReportStore');

// Mock the chart data processor utility
jest.mock('../../../utils/chartDataProcessor', () => ({
  processSafetyData: jest.fn(),
}));

// Mock the screen component
jest.mock('../../../screens/Driving/SafetyReportScreen', () => {
  const React = require('react');
  return ({ 
    safetyData,
    selectedTab,
    options,
    loading,
    formattedBarData,
    pieData,
    formattedLineData,
    onTabSelect,
    onBackPress,
  }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="safety-report-screen">
        <Text testID="total-score">{safetyData.score}</Text>
        <Text testID="selected-tab">{selectedTab}</Text>
        <Text testID="loading">{loading ? 'Loading' : 'Not Loading'}</Text>
        <Text testID="acceleration-score">{safetyData.acceleration.score}</Text>
        <Text testID="turning-score">{safetyData.turning.score}</Text>
        <Text testID="speeding-score">{safetyData.speeding.score}</Text>
        <Text testID="acceleration-feedback">{safetyData.acceleration.feedback}</Text>
        <Text testID="turning-feedback">{safetyData.turning.feedback}</Text>
        <Text testID="speeding-feedback">{safetyData.speeding.feedback}</Text>
        <Text testID="bar-data-count">{formattedBarData.length}</Text>
        <Text testID="pie-data-count">{pieData.length}</Text>
        <Text testID="line-data-count">{formattedLineData.length}</Text>
        
        {options.map((option: string) => (
          <TouchableOpacity
            key={option}
            testID={`tab-${option}`}
            onPress={() => onTabSelect(option)}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          testID="back-button"
          onPress={onBackPress}
        >
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

const mockRoute = {
  params: { driveId: '123' },
  key: 'test-route',
  name: 'SafetyReport',
};

// Mock the hooks
(useNavigation as jest.Mock).mockReturnValue(mockNavigation);
(useRoute as jest.Mock).mockReturnValue(mockRoute);

describe('SafetyReportContainer', () => {
  const mockStoreState = {
    data: null,
    loading: false,
    error: null,
    fetchSafetyReport: jest.fn(),
  };

  const mockSafetyReportData = {
    score: 88,
    acceleration: {
      score: 85,
      feedback: '급가감속 운전이 양호합니다.',
      graph: [
        { time: '2024-01-01T10:00:00Z', flag: true },
        { time: '2024-01-01T10:15:00Z', flag: false },
        { time: '2024-01-01T10:30:00Z', flag: true },
        { time: '2024-01-01T10:45:00Z', flag: false },
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
        { period: 3, maxSpeed: 95 },
      ],
    },
  };

  const mockProcessedChartData = {
    processedData: {
      score: 88,
      acceleration: { score: 85, title: '급가감속 분석', feedback: '급가감속 운전이 양호합니다.' },
      turning: { score: 92, title: '급회전 분석', feedback: '급회전이 적어 안전합니다.', safeRatio: 92 },
      speeding: { score: 87, title: '과속 분석', feedback: '과속 운전이 양호합니다.', violations: 1, speedLimit: 100 },
    },
    formattedBarData: [
      { value: 85, label: '10:00', frontColor: '#E53E3E' },
      { value: 60, label: '10:15', frontColor: '#4CAF50' },
    ],
    pieData: [
      { value: 92, color: '#4CAF50' },
      { value: 8, color: '#E53E3E' },
    ],
    formattedLineData: [
      { value: 65, label: '구간 1' },
      { value: 78, label: '구간 2' },
      { value: 95, label: '구간 3' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSafetyReportStore as jest.Mock).mockReturnValue(mockStoreState);
    (processSafetyData as jest.Mock).mockReturnValue(mockProcessedChartData);
  });

  describe('Component Rendering', () => {
    it('should render correctly with initial empty state', () => {
      // Arrange & Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      expect(getByTestId('safety-report-screen')).toBeTruthy();
      expect(getByTestId('total-score')).toHaveTextContent('0');
      expect(getByTestId('selected-tab')).toHaveTextContent('급가감속');
      expect(getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    it('should display loading state when data is being fetched', () => {
      // Arrange
      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        loading: true,
      });

      // Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      expect(getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('should render all tab options correctly', () => {
      // Arrange & Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      expect(getByTestId('tab-급가감속')).toBeTruthy();
      expect(getByTestId('tab-급회전')).toBeTruthy();
      expect(getByTestId('tab-과속')).toBeTruthy();
    });

    it('should start with default empty safety data when no data is loaded', () => {
      // Arrange & Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      expect(getByTestId('acceleration-score')).toHaveTextContent('0');
      expect(getByTestId('turning-score')).toHaveTextContent('0');
      expect(getByTestId('speeding-score')).toHaveTextContent('0');
      expect(getByTestId('acceleration-feedback')).toHaveTextContent('');
      expect(getByTestId('turning-feedback')).toHaveTextContent('');
      expect(getByTestId('speeding-feedback')).toHaveTextContent('');
    });
  });

  describe('Data Fetching', () => {
    it('should fetch safety report on mount with driveId from route params', () => {
      // Arrange & Act
      render(<SafetyReportContainer />);

      // Assert
      expect(mockStoreState.fetchSafetyReport).toHaveBeenCalledWith('123');
      expect(mockStoreState.fetchSafetyReport).toHaveBeenCalledTimes(1);
    });

    it('should use default driveId when route params are missing', () => {
      // Arrange
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: undefined,
      });

      // Act
      render(<SafetyReportContainer />);

      // Assert
      expect(mockStoreState.fetchSafetyReport).toHaveBeenCalledWith('1');
    });

    it('should refetch data when driveId changes', () => {
      // Arrange
      const { rerender } = render(<SafetyReportContainer />);
      
      // Act - change route params
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: { driveId: '456' },
      });
      rerender(<SafetyReportContainer />);

      // Assert
      expect(mockStoreState.fetchSafetyReport).toHaveBeenCalledWith('456');
    });
  });

  describe('Data Processing', () => {
    beforeEach(() => {
      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockSafetyReportData,
      });
    });

    it('should process and display safety report data correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('total-score')).toHaveTextContent('88');
        expect(getByTestId('acceleration-score')).toHaveTextContent('85');
        expect(getByTestId('turning-score')).toHaveTextContent('92');
        expect(getByTestId('speeding-score')).toHaveTextContent('87');
      });
    });

    it('should call processSafetyData with correct processed data structure', async () => {
      // Arrange & Act
      render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(processSafetyData).toHaveBeenCalledWith(
          expect.objectContaining({
            score: 88,
            acceleration: expect.objectContaining({
              score: 85,
              title: '급가감속 분석',
              feedback: '급가감속 운전이 양호합니다.',
              statistics: expect.objectContaining({
                totalEvents: 4,
                highAcceleration: 2,
                normalAcceleration: 2,
              }),
              chartData: expect.arrayContaining([
                expect.objectContaining({
                  accelerationType: '급가속',
                  frontColor: '#E53E3E',
                }),
                expect.objectContaining({
                  accelerationType: '정상가속',
                  frontColor: '#4CAF50',
                }),
              ]),
            }),
            turning: expect.objectContaining({
              score: 92,
              title: '급회전 분석',
              feedback: '급회전이 적어 안전합니다.',
              safeRatio: 92,
              chartData: {
                safe: 92,
                unsafe: 8,
              },
            }),
            speeding: expect.objectContaining({
              score: 87,
              title: '과속 분석',
              feedback: '과속 운전이 양호합니다.',
              violations: 1,
              speedLimit: 100,
              chartData: expect.arrayContaining([
                { value: 65, label: '구간 1' },
                { value: 78, label: '구간 2' },
                { value: 95, label: '구간 3' },
              ]),
            }),
          })
        );
      });
    });

    it('should set chart data from processSafetyData result', async () => {
      // Arrange & Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('bar-data-count')).toHaveTextContent('2');
        expect(getByTestId('pie-data-count')).toHaveTextContent('2');
        expect(getByTestId('line-data-count')).toHaveTextContent('3');
      });
    });

    it('should calculate acceleration statistics correctly', async () => {
      // Arrange & Act
      render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(processSafetyData).toHaveBeenCalledWith(
          expect.objectContaining({
            acceleration: expect.objectContaining({
              statistics: expect.objectContaining({
                totalEvents: 4,
                highAcceleration: 2, // 2 events with flag: true
                normalAcceleration: 2, // 2 events with flag: false
                formula: expect.objectContaining({
                  normal: 2,
                  high: 2,
                  calculated: 50, // 100 * 2 / 4 = 50
                }),
              }),
            }),
          })
        );
      });
    });

    it('should format acceleration chart data with correct time labels', async () => {
      // Arrange & Act
      render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(processSafetyData).toHaveBeenCalledWith(
          expect.objectContaining({
            acceleration: expect.objectContaining({
              chartData: expect.arrayContaining([
                expect.objectContaining({
                  label: '10:00',
                  time: '2024-01-01T10:00:00Z',
                }),
                expect.objectContaining({
                  label: '10:15',
                  time: '2024-01-01T10:15:00Z',
                }),
              ]),
            }),
          })
        );
      });
    });
  });

  describe('Tab Functionality', () => {
    beforeEach(() => {
      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockSafetyReportData,
      });
    });

    it('should start with acceleration tab selected', async () => {
      // Arrange & Act
      const { getByTestId } = render(<SafetyReportContainer />);

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('급가감속');
    });

    it('should change to turning tab when selected', async () => {
      // Arrange
      const { getByTestId } = render(<SafetyReportContainer />);

      // Act
      fireEvent.press(getByTestId('tab-급회전'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('급회전');
    });

    it('should change to speeding tab when selected', async () => {
      // Arrange
      const { getByTestId } = render(<SafetyReportContainer />);

      // Act
      fireEvent.press(getByTestId('tab-과속'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('과속');
    });

    it('should switch back to acceleration tab', async () => {
      // Arrange
      const { getByTestId } = render(<SafetyReportContainer />);

      // Act
      fireEvent.press(getByTestId('tab-급회전'));
      fireEvent.press(getByTestId('tab-급가감속'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('급가감속');
    });
  });

  describe('Navigation', () => {
    it('should call navigation.goBack when back button is pressed', () => {
      // Arrange
      const { getByTestId } = render(<SafetyReportContainer />);

      // Act
      fireEvent.press(getByTestId('back-button'));

      // Assert
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      // Arrange
      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: null,
      });

      // Act & Assert - Should not crash
      expect(() => render(<SafetyReportContainer />)).not.toThrow();
    });

    it('should handle incomplete data gracefully', () => {
      // Arrange
      const incompleteData = {
        score: 70,
        acceleration: {
          score: 65,
          feedback: '급가감속 주의 필요',
          graph: [],
        },
        // Missing sharpTurn and overSpeed
      };

      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: incompleteData,
      });

      // Act & Assert - Should not crash
      expect(() => render(<SafetyReportContainer />)).not.toThrow();
    });

    it('should handle empty graph arrays gracefully', () => {
      // Arrange
      const dataWithEmptyGraphs = {
        ...mockSafetyReportData,
        acceleration: {
          ...mockSafetyReportData.acceleration,
          graph: [],
        },
        overSpeed: {
          ...mockSafetyReportData.overSpeed,
          graph: [],
        },
      };

      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithEmptyGraphs,
      });

      // Act & Assert - Should not crash and should calculate zero statistics
      expect(() => render(<SafetyReportContainer />)).not.toThrow();
    });

    it('should handle processSafetyData throwing an error', () => {
      // Arrange
      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockSafetyReportData,
      });

      (processSafetyData as jest.Mock).mockImplementation(() => {
        throw new Error('Chart processing failed');
      });

      // Act & Assert - Should not crash
      expect(() => render(<SafetyReportContainer />)).not.toThrow();
    });
  });

  describe('Score Calculations', () => {
    it('should calculate turning unsafe percentage correctly', async () => {
      // Arrange
      const dataWithDifferentScore = {
        ...mockSafetyReportData,
        sharpTurn: {
          score: 75,
          feedback: '급회전 개선 필요',
        },
      };

      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithDifferentScore,
      });

      // Act
      render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(processSafetyData).toHaveBeenCalledWith(
          expect.objectContaining({
            turning: expect.objectContaining({
              chartData: {
                safe: 75,
                unsafe: 25,
              },
            }),
          })
        );
      });
    });

    it('should calculate speeding violations correctly when score is less than 100', async () => {
      // Arrange
      const dataWithViolations = {
        ...mockSafetyReportData,
        overSpeed: {
          score: 70,
          feedback: '과속 주의 필요',
          graph: [{ period: 1, maxSpeed: 120 }],
        },
      };

      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithViolations,
      });

      // Act
      render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(processSafetyData).toHaveBeenCalledWith(
          expect.objectContaining({
            speeding: expect.objectContaining({
              violations: 3, // (100 - 70) / 10 = 3
            }),
          })
        );
      });
    });

    it('should set zero violations when speeding score is 100', async () => {
      // Arrange
      const dataWithPerfectScore = {
        ...mockSafetyReportData,
        overSpeed: {
          score: 100,
          feedback: '과속 없음',
          graph: [{ period: 1, maxSpeed: 60 }],
        },
      };

      (useSafetyReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithPerfectScore,
      });

      // Act
      render(<SafetyReportContainer />);

      // Assert
      await waitFor(() => {
        expect(processSafetyData).toHaveBeenCalledWith(
          expect.objectContaining({
            speeding: expect.objectContaining({
              violations: 0,
            }),
          })
        );
      });
    });
  });
});
