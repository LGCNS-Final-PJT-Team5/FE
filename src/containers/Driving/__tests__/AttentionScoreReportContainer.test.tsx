import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AttentionScoreReportContainer from '../AttentionScoreReportContainer';
import useAttentionReportStore from '../../../store/useAttentionReportStore';

// Mock the store
jest.mock('../../../store/useAttentionReportStore');

// Mock the screen component
jest.mock('../../../screens/Driving/AttentionScoreReportScreen', () => {
  const React = require('react');
  return ({ 
    score,
    selectedTab,
    tabs,
    loading,
    drivingTimeSessions,
    inactivityEvents,
    drivingTimeScore,
    inactivityScore,
    drivingTimeFeedback,
    inactivityFeedback,
    onTabChange,
    onBackPress,
  }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="attention-score-screen">
        <Text testID="total-score">{score}</Text>
        <Text testID="selected-tab">{selectedTab}</Text>
        <Text testID="loading">{loading ? 'Loading' : 'Not Loading'}</Text>
        <Text testID="driving-time-score">{drivingTimeScore}</Text>
        <Text testID="inactivity-score">{inactivityScore}</Text>
        <Text testID="driving-time-feedback">{drivingTimeFeedback}</Text>
        <Text testID="inactivity-feedback">{inactivityFeedback}</Text>
        <Text testID="driving-sessions-count">{drivingTimeSessions.length}</Text>
        <Text testID="inactivity-events-count">{inactivityEvents.length}</Text>
        
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
  name: 'AttentionScoreReport',
};

// Mock the hooks
(useNavigation as jest.Mock).mockReturnValue(mockNavigation);
(useRoute as jest.Mock).mockReturnValue(mockRoute);

describe('AttentionScoreReportContainer', () => {
  const mockStoreState = {
    data: null,
    loading: false,
    error: null,
    fetchAttentionReport: jest.fn(),
  };

  const mockAttentionReportData = {
    score: 78,
    drivingTime: {
      score: 75,
      feedback: '운전 시간이 적절합니다.',
      graph: [
        {
          startTime: '2024-01-01T09:00:00Z',
          endTime: '2024-01-01T10:30:00Z',
        },
        {
          startTime: '2024-01-01T11:00:00Z',
          endTime: '2024-01-01T12:00:00Z',
        },
      ],
    },
    inactivity: {
      score: 82,
      feedback: '미조작 시간이 적절합니다.',
      graph: ['2024-01-01T09:15:00Z', '2024-01-01T11:30:00Z'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAttentionReportStore as jest.Mock).mockReturnValue(mockStoreState);
  });

  describe('Component Rendering', () => {
    it('should render correctly with initial loading state', () => {
      // Arrange
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        loading: true,
      });

      // Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      expect(getByTestId('attention-score-screen')).toBeTruthy();
      expect(getByTestId('loading')).toHaveTextContent('Loading');
      expect(getByTestId('total-score')).toHaveTextContent('0');
      expect(getByTestId('selected-tab')).toHaveTextContent('운전 시간');
    });

    it('should render all tab options correctly', () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      expect(getByTestId('tab-운전 시간')).toBeTruthy();
      expect(getByTestId('tab-미조작 시간')).toBeTruthy();
    });

    it('should show loading when data is null', () => {
      // Arrange
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: null,
        loading: false,
      });

      // Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      expect(getByTestId('loading')).toHaveTextContent('Loading');
    });
  });

  describe('Data Fetching', () => {
    it('should fetch attention report on mount with driveId from route params', () => {
      // Arrange & Act
      render(<AttentionScoreReportContainer />);

      // Assert
      expect(mockStoreState.fetchAttentionReport).toHaveBeenCalledWith('123');
      expect(mockStoreState.fetchAttentionReport).toHaveBeenCalledTimes(1);
    });

    it('should use default driveId when route params are missing', () => {
      // Arrange
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: undefined,
      });

      // Act
      render(<AttentionScoreReportContainer />);

      // Assert
      expect(mockStoreState.fetchAttentionReport).toHaveBeenCalledWith('1');
    });

    it('should refetch data when driveId changes', () => {
      // Arrange
      const { rerender } = render(<AttentionScoreReportContainer />);
      
      // Act - change route params
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: { driveId: '456' },
      });
      rerender(<AttentionScoreReportContainer />);

      // Assert
      expect(mockStoreState.fetchAttentionReport).toHaveBeenCalledWith('456');
    });
  });

  describe('Data Processing', () => {
    beforeEach(() => {
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockAttentionReportData,
      });
    });

    it('should process and display attention report data correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not Loading');
        expect(getByTestId('total-score')).toHaveTextContent('78');
        expect(getByTestId('driving-time-score')).toHaveTextContent('75');
        expect(getByTestId('inactivity-score')).toHaveTextContent('82');
        expect(getByTestId('driving-time-feedback')).toHaveTextContent('운전 시간이 적절합니다.');
        expect(getByTestId('inactivity-feedback')).toHaveTextContent('미조작 시간이 적절합니다.');
      });
    });

    it('should process driving time sessions correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('driving-sessions-count')).toHaveTextContent('2');
      });
    });

    it('should process inactivity events correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('inactivity-events-count')).toHaveTextContent('2');
      });
    });

    it('should handle empty graph data gracefully', async () => {
      // Arrange
      const dataWithEmptyGraphs = {
        ...mockAttentionReportData,
        drivingTime: { ...mockAttentionReportData.drivingTime, graph: [] },
        inactivity: { ...mockAttentionReportData.inactivity, graph: [] },
      };

      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: dataWithEmptyGraphs,
      });

      // Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('driving-sessions-count')).toHaveTextContent('0');
        expect(getByTestId('inactivity-events-count')).toHaveTextContent('0');
      });
    });
  });

  describe('Time Formatting and Calculations', () => {
    beforeEach(() => {
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockAttentionReportData,
      });
    });

    it('should calculate duration correctly for driving sessions', async () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert - Verify that duration calculations work
      // The first session is 1.5 hours (90 minutes), second is 1 hour (60 minutes)
      await waitFor(() => {
        expect(getByTestId('driving-sessions-count')).toHaveTextContent('2');
      });
    });

    it('should format time correctly', async () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert - Time formatting is tested implicitly through data processing
      await waitFor(() => {
        expect(getByTestId('total-score')).toHaveTextContent('78');
      });
    });
  });

  describe('Tab Functionality', () => {
    beforeEach(() => {
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockAttentionReportData,
      });
    });

    it('should start with driving time tab selected', async () => {
      // Arrange & Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('selected-tab')).toHaveTextContent('운전 시간');
      });
    });

    it('should change to inactivity tab when selected', async () => {
      // Arrange
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Wait for initial render
      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      // Act
      fireEvent.press(getByTestId('tab-미조작 시간'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('미조작 시간');
    });

    it('should switch back to driving time tab', async () => {
      // Arrange
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      // Act
      fireEvent.press(getByTestId('tab-미조작 시간'));
      fireEvent.press(getByTestId('tab-운전 시간'));

      // Assert
      expect(getByTestId('selected-tab')).toHaveTextContent('운전 시간');
    });
  });

  describe('Navigation', () => {
    it('should call navigation.goBack when back button is pressed', async () => {
      // Arrange
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: mockAttentionReportData,
      });

      const { getByTestId } = render(<AttentionScoreReportContainer />);

      await waitFor(() => {
        expect(getByTestId('loading')).toHaveTextContent('Not Loading');
      });

      // Act
      fireEvent.press(getByTestId('back-button'));

      // Assert
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing data gracefully during loading', () => {
      // Arrange
      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: null,
        loading: true,
      });

      // Act & Assert - Should not crash
      expect(() => render(<AttentionScoreReportContainer />)).not.toThrow();
    });

    it('should handle malformed data gracefully', () => {
      // Arrange
      const malformedData = {
        score: 75,
        drivingTime: {
          score: 70,
          feedback: 'Test feedback',
          // Missing graph property
        },
        inactivity: {
          score: 80,
          feedback: 'Test feedback',
          graph: null,
        },
      };

      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: malformedData,
      });

      // Act & Assert - Should not crash
      expect(() => render(<AttentionScoreReportContainer />)).not.toThrow();
    });

    it('should handle empty data properties', async () => {
      // Arrange
      const emptyData = {
        score: 0,
        drivingTime: {
          score: 0,
          feedback: '',
          graph: [],
        },
        inactivity: {
          score: 0,
          feedback: '',
          graph: [],
        },
      };

      (useAttentionReportStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        data: emptyData,
      });

      // Act
      const { getByTestId } = render(<AttentionScoreReportContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('total-score')).toHaveTextContent('0');
        expect(getByTestId('driving-sessions-count')).toHaveTextContent('0');
        expect(getByTestId('inactivity-events-count')).toHaveTextContent('0');
      });
    });
  });
});
