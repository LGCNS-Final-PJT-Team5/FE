import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {Alert} from 'react-native';
import {dashboardService} from '../src/services/api/dashboardService';
import {useNavigation} from '@react-navigation/native';
import type {UserResponse} from '../src/types/user';

// useUserStore mock을 selector 기반으로 생성
const mockUserSelector = jest.fn();
const mockHasHydratedSelector = jest.fn();

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../src/store/useUserStore', () => ({
  useUserStore: jest.fn(selector => {
    // selector 함수에 따라 다른 값을 반환
    if (selector.toString().includes('state.user')) {
      return mockUserSelector();
    }
    if (selector.toString().includes('state.hasHydrated')) {
      return mockHasHydratedSelector();
    }
    // fallback - selector 함수를 실행해서 적절한 값 반환
    const mockState = {
      user: mockUserSelector(),
      hasHydrated: mockHasHydratedSelector(),
    };
    return selector(mockState);
  }),
}));

jest.mock('../src/services/api/dashboardService', () => ({
  dashboardService: {
    getDashboard: jest.fn(),
  },
}));

jest.mock('../src/screens/Dashboard/DashboardScreen', () => {
  const {Text} = require('react-native');
  return jest.fn((props: any) => {
    // props를 전역 변수에 저장하여 테스트에서 접근 가능하게 함
    (global as any).lastDashboardScreenProps = props;
    return <Text testID="dashboard-screen">Dashboard Screen</Text>;
  });
});

// import는 mock 설정 후에
import DashboardContainer from '../src/containers/Dashboard/DashboardContainer';

// Alert mock
jest.spyOn(Alert, 'alert');

// Console error mock
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('DashboardContainer', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  };

  const mockUser: UserResponse = {
    reward: 1000,
    nickname: '테스트닉네임',
    name: '테스트 사용자',
    email: 'test@example.com',
    alarm: true,
  };

  const mockDashboard = {
    userId: 'user123',
    lastDrive: '2024-06-01T10:00:00Z',
    driveCount: 25,
    scores: {
      idlingScore: 85,
      speedMaintainScore: 90,
      ecoScore: 87,
      accelerationScore: 80,
      sharpTurnScore: 88,
      overSpeedScore: 92,
      safetyScore: 86,
      reactionScore: 89,
      laneDepartureScore: 91,
      followingDistanceScore: 87,
      accidentPreventionScore: 89,
      drivingTimeScore: 85,
      inactivityScore: 88,
      attentionScore: 86,
      totalScore: 87,
    },
  };

  const mockGetDashboard = dashboardService.getDashboard as jest.MockedFunction<
    typeof dashboardService.getDashboard
  >;
  const mockUseNavigation = useNavigation as jest.MockedFunction<
    typeof useNavigation
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigation.mockReturnValue(mockNavigation);
    consoleSpy.mockClear();

    // 전역 변수 초기화
    (global as any).lastDashboardScreenProps = null;

    // 기본 mock 설정
    mockUserSelector.mockReturnValue(mockUser);
    mockHasHydratedSelector.mockReturnValue(true);
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe('로딩 상태', () => {
    it('hasHydrated가 false일 때 로딩 화면을 표시한다', () => {
      // hasHydrated를 false로 설정
      mockHasHydratedSelector.mockReturnValue(false);

      const {getByText} = render(<DashboardContainer />);

      expect(getByText('대시보드 정보를 불러오는 중입니다.')).toBeTruthy();
    });

    it('데이터 로딩 중일 때 로딩 화면을 표시한다', async () => {
      // hasHydrated는 true이지만 API 호출이 pending 상태
      mockGetDashboard.mockImplementation(
        () => new Promise(() => {}), // never resolves
      );

      const {getByText} = render(<DashboardContainer />);

      expect(getByText('대시보드 정보를 불러오는 중입니다.')).toBeTruthy();
    });
  });

  describe('성공적인 데이터 로딩', () => {
    it('사용자와 대시보드 데이터가 있을 때 DashboardScreen을 렌더링한다', async () => {
      mockGetDashboard.mockResolvedValueOnce(mockDashboard);

      const {queryByText, getByTestId} = render(<DashboardContainer />);

      // API 호출이 완료되고 컴포넌트가 렌더링될 때까지 기다림
      await waitFor(
        () => {
          expect(getByTestId('dashboard-screen')).toBeTruthy();
        },
        {timeout: 10000},
      );

      // 로딩이 끝났는지 확인
      expect(queryByText('대시보드 정보를 불러오는 중입니다.')).toBeNull();
      expect(mockGetDashboard).toHaveBeenCalledTimes(1);
    });

    it('DashboardScreen에 올바른 props를 전달한다', async () => {
      mockGetDashboard.mockResolvedValueOnce(mockDashboard);

      render(<DashboardContainer />);

      // API 호출이 완료되고 props가 설정될 때까지 기다림
      await waitFor(
        () => {
          const props = (global as any).lastDashboardScreenProps;
          expect(props).not.toBeNull();
          expect(props.userInfo).toEqual(mockUser);
          expect(props.isEnabled).toBe(true);
          expect(props.dashboard).toEqual(mockDashboard);
        },
        {timeout: 10000},
      );

      // 전역 변수에서 props 확인
      const props = (global as any).lastDashboardScreenProps;
      expect(props.drivingReportData).toHaveLength(4);

      // drivingReportData 구조 검증
      expect(props.drivingReportData[0].title).toBe('탄소 배출 및 연비 점수');
      expect(props.drivingReportData[0].score).toBe(
        mockDashboard.scores.ecoScore,
      );
      expect(props.drivingReportData[1].title).toBe('안전 운전 점수');
      expect(props.drivingReportData[1].score).toBe(
        mockDashboard.scores.safetyScore,
      );
    });
  });

  describe('에러 처리', () => {
    it('대시보드 데이터 가져오기 실패 시 에러 알림을 표시한다', async () => {
      const errorMessage = 'Network Error';
      mockGetDashboard.mockRejectedValueOnce(new Error(errorMessage));

      render(<DashboardContainer />);

      await waitFor(
        () => {
          expect(consoleSpy).toHaveBeenCalledWith(
            '대시보드 데이터 가져오기 실패:',
            expect.any(Error),
          );
          expect(Alert.alert).toHaveBeenCalledWith(
            '오류',
            '대시보드 데이터를 불러오는 데 실패했습니다.',
          );
        },
        {timeout: 10000},
      );
    });

    it('에러 발생 후에도 로딩 상태가 해제된다', async () => {
      mockGetDashboard.mockRejectedValueOnce(new Error('Test Error'));

      const {queryByText} = render(<DashboardContainer />);

      // finally 블록에서 setLoading(false)가 호출될 때까지 기다림
      await waitFor(
        () => {
          expect(queryByText('대시보드 정보를 불러오는 중입니다.')).toBeNull();
        },
        {timeout: 10000},
      );
    });
  });

  describe('조건부 렌더링', () => {
    it('사용자 정보가 없을 때 로딩 화면이 계속 표시된다', () => {
      // user를 null로 설정
      mockUserSelector.mockReturnValue(null);

      const {getByText, queryByTestId} = render(<DashboardContainer />);

      // user가 null이면 useEffect가 실행되지 않아서 loading이 true로 유지됨
      expect(getByText('대시보드 정보를 불러오는 중입니다.')).toBeTruthy();
      expect(queryByTestId('dashboard-screen')).toBeNull();
    });

    it('대시보드 데이터가 없을 때 아무것도 렌더링하지 않는다', async () => {
      // 빈 객체나 undefined 반환하도록 수정
      mockGetDashboard.mockResolvedValueOnce(undefined as any);

      const {queryByTestId, queryByText} = render(<DashboardContainer />);

      await waitFor(
        () => {
          // 로딩이 끝났는지 확인
          expect(queryByText('대시보드 정보를 불러오는 중입니다.')).toBeNull();
        },
        {timeout: 10000},
      );

      // DashboardScreen이 렌더링되지 않았는지 확인
      expect(queryByTestId('dashboard-screen')).toBeNull();
      expect(mockGetDashboard).toHaveBeenCalledTimes(1);
    });
  });

  describe('useEffect 의존성', () => {
    it('hasHydrated나 user가 변경될 때만 useEffect가 실행된다', async () => {
      // 첫 번째 렌더링 - hasHydrated: false
      mockHasHydratedSelector.mockReturnValue(false);

      const {rerender} = render(<DashboardContainer />);

      expect(mockGetDashboard).not.toHaveBeenCalled();

      // 두 번째 렌더링 - hasHydrated: true
      mockHasHydratedSelector.mockReturnValue(true);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard);

      rerender(<DashboardContainer />);

      await waitFor(
        () => {
          expect(mockGetDashboard).toHaveBeenCalledTimes(1);
        },
        {timeout: 10000},
      );
    });
  });

  describe('상태 관리', () => {
    it('사용자의 알람 설정이 isEnabled 상태에 반영된다', async () => {
      const userWithAlarmOff = {...mockUser, alarm: false};

      // alarm이 false인 사용자로 설정
      mockUserSelector.mockReturnValue(userWithAlarmOff);
      mockGetDashboard.mockResolvedValueOnce(mockDashboard);

      render(<DashboardContainer />);

      // API 호출이 완료되고 props가 설정될 때까지 기다림
      await waitFor(
        () => {
          const props = (global as any).lastDashboardScreenProps;
          expect(props).not.toBeNull();
          expect(props.isEnabled).toBe(false); // alarm이 false이므로 isEnabled도 false
          expect(props.userInfo).toEqual(userWithAlarmOff);
        },
        {timeout: 10000},
      );
    });
  });
});
