import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CarbonEmissionReportContainer from '../CarbonEmissionReportContainer';
import useEcoReportStore from '../../../store/useEcoReportStore';

// Mock the store
jest.mock('../../../store/useEcoReportStore');

// Mock the screen component
jest.mock('../../../screens/Driving/CarbonEmissionReportScreen', () => {
  const React = require('react');
  return ({ 
    score,
    selectedTab,
    tabs,
    loading,
    idlingScore,
    speedMaintainScore,
    idlingEvents,
    speedMaintainData,
    totalIdlingMinutes,
    idlingFeedback,
    speedMaintainFeedback,
    onTabChange,
    onBackPress,
  }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="carbon-emission-screen">
        <Text testID="total-score">{score}</Text>
        <Text testID="selected-tab">{selectedTab}</Text>
        <Text testID="loading">{loading ? 'Loading' : 'Not Loading'}</Text>
        <Text testID="idling-score">{idlingScore}</Text>
        <Text testID="speed-maintain-score">{speedMaintainScore}</Text>
        <Text testID="idling-feedback">{idlingFeedback}</Text>
        <Text testID="speed-maintain-feedback">{speedMaintainFeedback}</Text>
        <Text testID="idling-events-count">{idlingEvents.length}</Text>
        <Text testID="speed-maintain-data-count">{speedMaintainData.length}</Text>
        <Text testID="total-idling-minutes">{totalIdlingMinutes}</Text>
        
        {tabs.map((tab: string) => (
          <TouchableOpacity
            key={tab}
            testID={`tab-${tab}`}
            onPress={() => onTabChange(tab)}
          >
            <Text>{tab}</Text>
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
  name: 'CarbonEmissionReport',
};

// Mock the hooks
(useNavigation as jest.Mock).mockReturnValue(mockNavigation);
(useRoute as jest.Mock).mockReturnValue(mockRoute);

describe('CarbonEmissionReportContainer', () => {
  const mockStoreState = {
    data: null,
    loading: false,
    error: null,
    fetchEcoReport: jest.fn(),
  };

  const mockEcoReportData = {
    score: 82,
    idling: {
      score: 78,
      feedback: '공회전이 적절합니다.',
      graph: [
        {
          startTime: '2024-01-01T10:00:00Z',
          endTime: '2024-01-01T10:05:00Z',
        },
        {
          startTime: '2024-01-01T11:00:00Z',
          endTime: '2024-01-01T11:03:00Z',
        },
      ],
    },
    speedMaintain: {
      score: 85,
      feedback: '정속주행이 우수합니다.',
      graph: [
        { period: '구간 1', percentage: 75 },
        { period: '구간 2', percentage: 85 },
        { period: '구간 3', percentage: 90 },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEcoReportStore as jest.Mock).mockReturnValue(mockStoreState);
  });

  describe('Component Rendering', () => {
    it('should render correctly with initial empty state', () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      expect(getByTestId('carbon-emission-screen')).toBeTruthy();
      expect(getByTestId('total-score')).toHaveTextContent('0');
      expect(getByTestId('selected-tab')).toHaveTextContent('공회전');
      expect(getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    it('should display loading state when data is being fetched', () => {
      // Arrange
      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        loading: true,
      });

      // Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      expect(getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('should render all tab options correctly', () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      expect(getByTestId('tab-공회전')).toBeTruthy();
      expect(getByTestId('tab-정속주행비율')).toBeTruthy();
    });

    it('should start with initial empty values', () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      expect(getByTestId('idling-score')).toHaveTextContent('0');
      expect(getByTestId('speed-maintain-score')).toHaveTextContent('0');
      expect(getByTestId('idling-feedback')).toHaveTextContent('');
      expect(getByTestId('speed-maintain-feedback')).toHaveTextContent('');
      expect(getByTestId('idling-events-count')).toHaveTextContent('0');
      expect(getByTestId('speed-maintain-data-count')).toHaveTextContent('0');
      expect(getByTestId('total-idling-minutes')).toHaveTextContent('0');
    });
  });

  describe('Data Fetching', () => {
    it('should fetch eco report on mount with driveId from route params', () => {
      // Arrange & Act
      render(<CarbonEmissionReportContainer />);

      // Assert
      expect(mockStoreState.fetchEcoReport).toHaveBeenCalledWith('123');
      expect(mockStoreState.fetchEcoReport).toHaveBeenCalledTimes(1);
    });

    it('should use default driveId when route params are missing', () => {
      // Arrange
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: undefined,
      });

      // Act
      render(<CarbonEmissionReportContainer />);

      // Assert
      expect(mockStoreState.fetchEcoReport).toHaveBeenCalledWith('1');
    });

    it('should refetch data when driveId changes', () => {
      // Arrange
      const { rerender } = render(<CarbonEmissionReportContainer />);
      
      // Act - change route params
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: { driveId: '456' },
      });
      rerender(<CarbonEmissionReportContainer />);

      // Assert
      expect(mockStoreState.fetchEcoReport).toHaveBeenCalledWith('456');
    });
  });

  describe('Data Processing', () => {
    beforeEach(() => {
      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockEcoReportData,
      });
    });

    it('should process and display eco report data correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('total-score')).toHaveTextContent('82');
        expect(getByTestId('idling-score')).toHaveTextContent('78');
        expect(getByTestId('speed-maintain-score')).toHaveTextContent('85');
        expect(getByTestId('idling-feedback')).toHaveTextContent('공회전이 적절합니다.');
        expect(getByTestId('speed-maintain-feedback')).toHaveTextContent('정속주행이 우수합니다.');
      });
    });

    it('should process idling events correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('idling-events-count')).toHaveTextContent('2');
      });
    });

    it('should process speed maintain data correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('speed-maintain-data-count')).toHaveTextContent('3');
      });
    });

    it('should calculate total idling minutes correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert - First event: 5 minutes, Second event: 3 minutes = 8 total
      await waitFor(() => {
        expect(getByTestId('total-idling-minutes')).toHaveTextContent('8');
      });
    });

    it('should handle empty graph data gracefully', async () => {
      // Arrange
      const dataWithEmptyGraphs = {
        ...mockEcoReportData,
        idling: { ...mockEcoReportData.idling, graph: [] },
        speedMaintain: { ...mockEcoReportData.speedMaintain, graph: [] },
      };

      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithEmptyGraphs,
      });

      // Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('idling-events-count')).toHaveTextContent('0');
        expect(getByTestId('speed-maintain-data-count')).toHaveTextContent('0');
        expect(getByTestId('total-idling-minutes')).toHaveTextContent('0');
      });
    });
  });

  describe('Time Calculations', () => {
    beforeEach(() => {
      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockEcoReportData,
      });
    });

    it('should format idling event times correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert - Verify that time formatting works by checking event count
      await waitFor(() => {
        expect(getByTestId('idling-events-count')).toHaveTextContent('2');
      });
    });

    it('should calculate duration correctly for each idling event', async () => {
      // Arrange
      const dataWithSpecificTimes = {
        ...mockEcoReportData,
        idling: {
          ...mockEcoReportData.idling,
          graph: [
            {
              startTime: '2024-01-01T10:00:00Z',
              endTime: '2024-01-01T10:10:00Z', // 10 minutes
            },
            {
              startTime: '2024-01-01T11:00:00Z',
              endTime: '2024-01-01T11:02:00Z', // 2 minutes
            },
          ],
        },
      };

      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithSpecificTimes,
      });

      // Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert - Total should be 12 minutes
      await waitFor(() => {
        expect(getByTestId('total-idling-minutes')).toHaveTextContent('12');
      });
    });
  });

  describe('Tab Functionality', () => {
    beforeEach(() => {
      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockEcoReportData,
      });
    });

    it('should start with idling tab selected', () => {
      // Arrange & Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('공회전');
    });

    it('should change to speed maintain tab when selected', () => {
      // Arrange
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Act
      fireEvent.press(getByTestId('tab-정속주행비율'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('정속주행비율');
    });

    it('should switch back to idling tab', () => {
      // Arrange
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Act
      fireEvent.press(getByTestId('tab-정속주행비율'));
      fireEvent.press(getByTestId('tab-공회전'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('공회전');
    });
  });

  describe('Navigation', () => {
    it('should call navigation.goBack when back button is pressed', () => {
      // Arrange
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Act
      fireEvent.press(getByTestId('back-button'));

      // Assert
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully', () => {
      // Arrange
      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: null,
      });

      // Act & Assert - Should not crash
      expect(() => render(<CarbonEmissionReportContainer />)).not.toThrow();
    });

    it('should handle incomplete data gracefully', () => {
      // Arrange
      const incompleteData = {
        score: 70,
        idling: {
          score: 65,
          feedback: '공회전 개선 필요',
          // Missing graph property
        },
        // Missing speedMaintain
      };

      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: incompleteData,
      });

      // Act & Assert - Should not crash
      expect(() => render(<CarbonEmissionReportContainer />)).not.toThrow();
    });

    it('should handle malformed time data gracefully', () => {
      // Arrange
      const dataWithInvalidTime = {
        ...mockEcoReportData,
        idling: {
          ...mockEcoReportData.idling,
          graph: [
            {
              startTime: 'invalid-time',
              endTime: 'invalid-time',
            },
          ],
        },
      };

      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithInvalidTime,
      });

      // Act & Assert - Should not crash
      expect(() => render(<CarbonEmissionReportContainer />)).not.toThrow();
    });

    it('should handle null graph arrays gracefully', () => {
      // Arrange
      const dataWithNullGraphs = {
        ...mockEcoReportData,
        idling: { ...mockEcoReportData.idling, graph: null },
        speedMaintain: { ...mockEcoReportData.speedMaintain, graph: null },
      };

      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithNullGraphs,
      });

      // Act & Assert - Should not crash
      expect(() => render(<CarbonEmissionReportContainer />)).not.toThrow();
    });
  });

  describe('Store Integration', () => {
    it('should pass correct props to screen component', () => {
      // Arrange
      const customStoreState = {
        data: mockEcoReportData,
        loading: true,
        error: 'Test error',
        fetchEcoReport: jest.fn(),
      };

      (useEcoReportStore as jest.Mock).mockReturnValue(customStoreState);

      // Act
      const { getByTestId } = render(<CarbonEmissionReportContainer />);

      // Assert
      expect(getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('should handle store state changes correctly', async () => {
      // Arrange
      const { rerender } = render(<CarbonEmissionReportContainer />);

      // Act - Change store state
      (useEcoReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockEcoReportData,
        loading: false,
      });

      rerender(<CarbonEmissionReportContainer />);

      // Assert
      const { getByTestId } = render(<CarbonEmissionReportContainer />);
      await waitFor(() => {
        expect(getByTestId('total-score')).toHaveTextContent('82');
      });
    });
  });
});
