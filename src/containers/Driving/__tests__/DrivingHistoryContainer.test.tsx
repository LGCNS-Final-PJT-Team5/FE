import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import DrivingHistoryContainer from '../DrivingHistoryContainer';

// Import for mocking
const { useNavigation } = require('@react-navigation/native');

// Mock the store
const mockFetchDriveHistory = jest.fn();
const mockStoreState = {
  driveHistory: [],
  fetchDriveHistory: mockFetchDriveHistory,
  isLoading: false,
  error: null,
};

jest.mock('../../../store/drivingHistoryStore', () => ({
  useDrivingHistoryStore: jest.fn(() => mockStoreState),
}));

// Mock the screen component
jest.mock('../../../screens/Driving/DrivingHistoryScreen', () => {
  return ({ 
    driveHistory,
    handleDriveItemPress,
    isLoading,
    error,
  }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="driving-history-screen">
        <Text testID="loading">{isLoading ? 'Loading' : 'Not Loading'}</Text>
        <Text testID="error">{error || 'No Error'}</Text>
        <Text testID="drive-history-count">{driveHistory.length}</Text>
        
        {driveHistory.map((drive: any, index: number) => (
          <TouchableOpacity
            key={drive.id || index}
            testID={`drive-item-${drive.id || index}`}
            onPress={() => handleDriveItemPress(drive.id)}
          >
            <Text testID={`drive-title-${drive.id || index}`}>{drive.title}</Text>
            <Text testID={`drive-date-${drive.id || index}`}>{drive.date}</Text>
            <Text testID={`drive-score-${drive.id || index}`}>{drive.score}</Text>
          </TouchableOpacity>
        ))}
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

// Mock the hooks
(useNavigation as jest.Mock).mockReturnValue(mockNavigation);

describe('DrivingHistoryContainer', () => {
  const mockDriveHistoryData = [
    {
      id: '1',
      title: '홈 → 직장',
      date: '2024-01-01',
      score: 85,
      distance: '15.2km',
      duration: '25분',
    },
    {
      id: '2',
      title: '직장 → 마트',
      date: '2024-01-02',
      score: 92,
      distance: '8.5km',
      duration: '12분',
    },
    {
      id: '3',
      title: '마트 → 홈',
      date: '2024-01-02',
      score: 78,
      distance: '10.1km',
      duration: '18분',
    },
  ];

  const { useDrivingHistoryStore } = require('../../../store/drivingHistoryStore');

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock store to default state
    (useDrivingHistoryStore as jest.Mock).mockReturnValue(mockStoreState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the DrivingHistoryScreen with correct props', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: mockDriveHistoryData,
      });

      // Act
      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Assert
      expect(getByTestId('driving-history-screen')).toBeTruthy();
      expect(getByTestId('drive-history-count')).toHaveTextContent('3');
      expect(getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(getByTestId('error')).toHaveTextContent('No Error');
    });

    it('should display loading state when isLoading is true', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        isLoading: true,
      });

      // Act
      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Assert
      expect(getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('should display error message when error exists', () => {
      // Arrange
      const errorMessage = '데이터를 불러올 수 없습니다';
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        error: errorMessage,
      });

      // Act
      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Assert
      expect(getByTestId('error')).toHaveTextContent(errorMessage);
    });

    it('should render drive history items correctly', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: mockDriveHistoryData,
      });

      // Act
      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Assert
      mockDriveHistoryData.forEach((drive) => {
        expect(getByTestId(`drive-title-${drive.id}`)).toHaveTextContent(drive.title);
        expect(getByTestId(`drive-date-${drive.id}`)).toHaveTextContent(drive.date);
        expect(getByTestId(`drive-score-${drive.id}`)).toHaveTextContent(drive.score.toString());
      });
    });
  });

  describe('Data Fetching', () => {
    it('should call fetchDriveHistory on component mount', () => {
      // Act
      render(<DrivingHistoryContainer />);

      // Assert
      expect(mockFetchDriveHistory).toHaveBeenCalledTimes(1);
    });
  });

  describe('Navigation', () => {
    it('should navigate to DrivingDetail when drive item is pressed', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: mockDriveHistoryData,
      });

      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Act
      fireEvent.press(getByTestId('drive-item-1'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenCalledWith('DrivingDetail', {
        drivingId: '1',
      });
    });

    it('should navigate with correct drivingId for different items', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: mockDriveHistoryData,
      });

      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Act
      fireEvent.press(getByTestId('drive-item-1'));
      fireEvent.press(getByTestId('drive-item-2'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'DrivingDetail', {
        drivingId: '1',
      });
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'DrivingDetail', {
        drivingId: '2',
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty drive history gracefully', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: [],
      });

      // Act
      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Assert
      expect(getByTestId('drive-history-count')).toHaveTextContent('0');
    });

    it('should handle null drive history gracefully', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: null,
      });

      // Act & Assert - Should not crash
      expect(() => render(<DrivingHistoryContainer />)).not.toThrow();
    });

    it('should handle undefined drive history gracefully', () => {
      // Arrange
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: undefined,
      });

      // Act & Assert - Should not crash
      expect(() => render(<DrivingHistoryContainer />)).not.toThrow();
    });
  });

  describe('Store Integration', () => {
    it('should use the correct store hook', () => {
      // Act
      render(<DrivingHistoryContainer />);

      // Assert
      expect(useDrivingHistoryStore).toHaveBeenCalled();
    });

    it('should pass the correct props to the screen component', async () => {
      // Arrange
      const testData = [mockDriveHistoryData[0]];
      (useDrivingHistoryStore as jest.Mock).mockReturnValue({
        ...mockStoreState,
        driveHistory: testData,
        isLoading: true,
        error: 'Test error',
      });

      // Act
      const { getByTestId } = render(<DrivingHistoryContainer />);

      // Assert
      await waitFor(() => {
        expect(getByTestId('drive-history-count')).toHaveTextContent('1');
        expect(getByTestId('loading')).toHaveTextContent('Loading');
        expect(getByTestId('error')).toHaveTextContent('Test error');
      });
    });
  });
});
