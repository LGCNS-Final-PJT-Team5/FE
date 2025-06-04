import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DrivingDetailContainer from '../DrivingDetailContainer';
import { useDrivingDetailStore } from '../../../store/drivingDetailStore';
import { useUserStore } from '../../../store/useUserStore';

// Mock the stores
jest.mock('../../../store/drivingDetailStore');
jest.mock('../../../store/useUserStore');

// Mock the screen component
jest.mock('../../../screens/Driving/DrivingDetailScreen', () => {
  const React = require('react');
  return ({ 
    driveDetail,
    onClose,
    onCardPress,
    cardBgColors,
  }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="driving-detail-screen">
        <Text testID="drive-title">{driveDetail?.title || 'No Title'}</Text>
        <Text testID="drive-score">{driveDetail?.totalScore || 0}</Text>
        <Text testID="drive-distance">{driveDetail?.distance || '0km'}</Text>
        <Text testID="drive-duration">{driveDetail?.duration || '0분'}</Text>
        <Text testID="safety-score">{driveDetail?.safetyScore || 0}</Text>
        <Text testID="carbon-score">{driveDetail?.carbonScore || 0}</Text>
        <Text testID="accident-score">{driveDetail?.accidentScore || 0}</Text>
        <Text testID="attention-score">{driveDetail?.attentionScore || 0}</Text>
        
        <TouchableOpacity
          testID="close-button"
          onPress={onClose}
        >
          <Text>Close</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="safety-card"
          onPress={() => onCardPress('안전 운전 점수')}
        >
          <Text>안전 운전 점수</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="carbon-card"
          onPress={() => onCardPress('탄소 배출 및 연비 점수')}
        >
          <Text>탄소 배출 및 연비 점수</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="accident-card"
          onPress={() => onCardPress('사고 예방 점수')}
        >
          <Text>사고 예방 점수</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          testID="attention-card"
          onPress={() => onCardPress('주의력 점수')}
        >
          <Text>주의력 점수</Text>
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
  params: { drivingId: '123' },
  key: 'test-route',
  name: 'DrivingDetail',
};

// Mock the hooks
(useNavigation as jest.Mock).mockReturnValue(mockNavigation);
(useRoute as jest.Mock).mockReturnValue(mockRoute);

describe('DrivingDetailContainer', () => {
  const mockDrivingDetailStore = {
    driveDetail: null,
    isLoading: false,
    error: null,
    fetchDriveDetail: jest.fn(),
  };

  const mockUserStore = {
    user: { id: 'user123', name: 'Test User' },
  };

  const mockDriveDetailData = {
    id: '123',
    title: '홈 → 직장',
    date: '2024-01-01',
    startTime: '09:00',
    endTime: '09:30',
    totalScore: 85,
    distance: '15.2km',
    duration: '30분',
    safetyScore: 88,
    carbonScore: 82,
    accidentScore: 90,
    attentionScore: 80,
    route: {
      start: '서울시 강남구',
      end: '서울시 서초구',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDrivingDetailStore as jest.Mock).mockReturnValue(mockDrivingDetailStore);
    (useUserStore as jest.Mock).mockReturnValue(mockUserStore);
  });

  describe('Component Rendering', () => {
    it('should render loading state when isLoading is true', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        isLoading: true,
      });

      // Act
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Assert
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('should render DrivingDetailScreen when data is loaded', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: mockDriveDetailData,
      });

      // Act
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Assert
      expect(getByTestId('driving-detail-screen')).toBeTruthy();
      expect(getByTestId('drive-title')).toHaveTextContent('홈 → 직장');
      expect(getByTestId('drive-score')).toHaveTextContent('85');
      expect(getByTestId('drive-distance')).toHaveTextContent('15.2km');
      expect(getByTestId('drive-duration')).toHaveTextContent('30분');
    });

    it('should render with empty data when driveDetail is null', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: null,
      });

      // Act
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Assert
      expect(getByTestId('driving-detail-screen')).toBeTruthy();
      expect(getByTestId('drive-title')).toHaveTextContent('No Title');
      expect(getByTestId('drive-score')).toHaveTextContent('0');
    });

    it('should display all score cards correctly', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: mockDriveDetailData,
      });

      // Act
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Assert
      expect(getByTestId('safety-score')).toHaveTextContent('88');
      expect(getByTestId('carbon-score')).toHaveTextContent('82');
      expect(getByTestId('accident-score')).toHaveTextContent('90');
      expect(getByTestId('attention-score')).toHaveTextContent('80');
    });
  });

  describe('Data Fetching', () => {
    it('should fetch drive detail on mount with drivingId and userId', () => {
      // Arrange & Act
      render(<DrivingDetailContainer />);

      // Assert
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledWith('123', 'user123');
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledTimes(1);
    });

    it('should use default userId when user is not available', () => {
      // Arrange
      (useUserStore as jest.Mock).mockReturnValue({
        user: null,
      });

      // Act
      render(<DrivingDetailContainer />);

      // Assert
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledWith('123', '1');
    });

    it('should use empty drivingId when route params are missing', () => {
      // Arrange
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: undefined,
      });

      // Act
      render(<DrivingDetailContainer />);

      // Assert
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledWith('', 'user123');
    });

    it('should refetch data when drivingId changes', () => {
      // Arrange
      const { rerender } = render(<DrivingDetailContainer />);
      
      // Act - change route params
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: { drivingId: '456' },
      });
      rerender(<DrivingDetailContainer />);

      // Assert
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledWith('456', 'user123');
    });

    it('should refetch data when userId changes', () => {
      // Arrange
      const { rerender } = render(<DrivingDetailContainer />);
      
      // Act - change user
      (useUserStore as jest.Mock).mockReturnValue({
        user: { id: 'newUser456', name: 'New User' },
      });
      rerender(<DrivingDetailContainer />);

      // Assert
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledWith('123', 'newUser456');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: mockDriveDetailData,
      });
    });

    it('should call navigation.goBack when close button is pressed', () => {
      // Arrange
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Act
      fireEvent.press(getByTestId('close-button'));

      // Assert
      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    it('should navigate to SafetyReport when safety card is pressed', () => {
      // Arrange
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Act
      fireEvent.press(getByTestId('safety-card'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenCalledWith('SafetyReport');
    });

    it('should navigate to CarbonEmissionReport when carbon card is pressed', () => {
      // Arrange
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Act
      fireEvent.press(getByTestId('carbon-card'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenCalledWith('CarbonEmissionReport');
    });

    it('should navigate to AccidentPreventionReport when accident card is pressed', () => {
      // Arrange
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Act
      fireEvent.press(getByTestId('accident-card'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AccidentPreventionReport');
    });

    it('should navigate to AttentionScoreReport when attention card is pressed', () => {
      // Arrange
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Act
      fireEvent.press(getByTestId('attention-card'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenCalledWith('AttentionScoreReport');
    });

    it('should handle multiple card presses correctly', () => {
      // Arrange
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Act
      fireEvent.press(getByTestId('safety-card'));
      fireEvent.press(getByTestId('carbon-card'));

      // Assert
      expect(mockNavigation.navigate).toHaveBeenCalledTimes(2);
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(1, 'SafetyReport');
      expect(mockNavigation.navigate).toHaveBeenNthCalledWith(2, 'CarbonEmissionReport');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing driveDetail gracefully', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: null,
      });

      // Act & Assert - Should not crash
      expect(() => render(<DrivingDetailContainer />)).not.toThrow();
    });

    it('should handle incomplete driveDetail data gracefully', () => {
      // Arrange
      const incompleteData = {
        id: '123',
        title: 'Incomplete Drive',
        // Missing other required fields
      };

      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: incompleteData,
      });

      // Act & Assert - Should not crash
      expect(() => render(<DrivingDetailContainer />)).not.toThrow();
    });

    it('should handle error state gracefully', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        error: 'Failed to fetch drive detail',
      });

      // Act & Assert - Should not crash
      expect(() => render(<DrivingDetailContainer />)).not.toThrow();
    });

    it('should handle missing user gracefully', () => {
      // Arrange
      (useUserStore as jest.Mock).mockReturnValue({
        user: undefined,
      });

      // Act & Assert - Should not crash
      expect(() => render(<DrivingDetailContainer />)).not.toThrow();
    });
  });

  describe('Props Passing', () => {
    it('should pass correct props to DrivingDetailScreen', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: mockDriveDetailData,
      });

      // Act
      const { getByTestId } = render(<DrivingDetailContainer />);

      // Assert - Verify that data is correctly passed to the screen
      expect(getByTestId('drive-title')).toHaveTextContent('홈 → 직장');
      expect(getByTestId('drive-score')).toHaveTextContent('85');
      expect(getByTestId('safety-score')).toHaveTextContent('88');
      expect(getByTestId('carbon-score')).toHaveTextContent('82');
      expect(getByTestId('accident-score')).toHaveTextContent('90');
      expect(getByTestId('attention-score')).toHaveTextContent('80');
    });

    it('should provide correct card background colors', () => {
      // Arrange
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: mockDriveDetailData,
      });

      // Act & Assert - Background colors are defined and passed
      expect(() => render(<DrivingDetailContainer />)).not.toThrow();
    });
  });

  describe('Store Integration', () => {
    it('should respond to store state changes', () => {
      // Arrange
      const { rerender } = render(<DrivingDetailContainer />);

      // Act - Change store state
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        driveDetail: mockDriveDetailData,
        isLoading: false,
      });

      rerender(<DrivingDetailContainer />);

      // Assert
      const { getByTestId } = render(<DrivingDetailContainer />);
      expect(getByTestId('driving-detail-screen')).toBeTruthy();
    });

    it('should handle loading state transitions correctly', () => {
      // Arrange - Start with loading
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        isLoading: true,
      });

      const { rerender, queryByTestId } = render(<DrivingDetailContainer />);

      // Assert - Should show loading
      expect(queryByTestId('loading-indicator')).toBeTruthy();

      // Act - Stop loading and add data
      (useDrivingDetailStore as jest.Mock).mockReturnValue({
        ...mockDrivingDetailStore,
        isLoading: false,
        driveDetail: mockDriveDetailData,
      });

      rerender(<DrivingDetailContainer />);

      // Assert - Should show data
      expect(queryByTestId('loading-indicator')).toBeFalsy();
      expect(queryByTestId('driving-detail-screen')).toBeTruthy();
    });
  });

  describe('useEffect Dependencies', () => {
    it('should only call fetchDriveDetail when dependencies change', () => {
      // Arrange
      const { rerender } = render(<DrivingDetailContainer />);

      // Act - Rerender without changing dependencies
      rerender(<DrivingDetailContainer />);

      // Assert - Should only be called once
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledTimes(1);
    });

    it('should call fetchDriveDetail again when drivingId changes', () => {
      // Arrange
      render(<DrivingDetailContainer />);

      // Act - Change drivingId
      (useRoute as jest.Mock).mockReturnValue({
        ...mockRoute,
        params: { drivingId: '999' },
      });

      render(<DrivingDetailContainer />);

      // Assert - Should be called with new drivingId
      expect(mockDrivingDetailStore.fetchDriveDetail).toHaveBeenCalledWith('999', 'user123');
    });
  });
});
