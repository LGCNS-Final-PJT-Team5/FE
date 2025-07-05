import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';

// Mock the entire component first
const mockSeedsContainer = jest.fn();

// Mock useFocusEffect to use useEffect instead
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('../src/services/api/seedsService', () => ({
  seedsService: {
    getSeedBalance: jest.fn(),
    getSeedHistory: jest.fn(),
  },
}));

// Mock SeedsScreen
jest.mock('../src/screens/Seeds/SeedsScreen', () => {
  return jest.fn(({seeds, seedsHistory, loading, onScrollEnd}) => {
    const {Text, TouchableOpacity} = require('react-native');
    return (
      <>
        {loading ? <Text testID="loading">로딩중</Text> : null}
        <Text testID="balance">{seeds.balance}</Text>
        <Text testID="total">{seeds.total}</Text>
        <Text testID="history-count">{seedsHistory.length}</Text>
        <TouchableOpacity testID="scroll-end-btn" onPress={onScrollEnd}>
          <Text>스크롤끝</Text>
        </TouchableOpacity>
      </>
    );
  });
});

// Import AFTER all mocks
import SeedsContainer from '../src/containers/Seeds/SeedsContainer';
import {seedsService} from '../src/services/api/seedsService';
import {useFocusEffect} from '@react-navigation/native';

// Set up the mock implementation after import
const mockUseFocusEffect = useFocusEffect as jest.Mock;

describe('SeedsContainer', () => {
  const mockGetSeedBalance = seedsService.getSeedBalance as jest.Mock;
  const mockGetSeedHistory = seedsService.getSeedHistory as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up useFocusEffect to call the callback only once
    mockUseFocusEffect.mockImplementation(callback => {
      React.useEffect(() => {
        callback();
      }, []);
    });
  });

  it('초기 렌더링 시 잔액과 첫 페이지 내역을 불러온다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 100, total: 200});
    mockGetSeedHistory.mockResolvedValue({
      rewardHistory: [
        {
          id: 1,
          amount: 10,
          type: '적립',
          description: '테스트',
          balanceSnapshot: 110,
          createdAt: '2024-01-01',
        },
      ],
      pageInfo: {page: 0, totalPages: 2},
    });

    const {getByTestId} = render(<SeedsContainer />);

    await waitFor(() => {
      expect(mockGetSeedBalance).toHaveBeenCalled();
      expect(mockGetSeedHistory).toHaveBeenCalledWith(0);
    });

    await waitFor(() => {
      expect(getByTestId('balance')).toHaveTextContent('100');
      expect(getByTestId('total')).toHaveTextContent('200');
      expect(getByTestId('history-count')).toHaveTextContent('1');
    });
  });

  it('내역이 없을 때 빈 배열을 전달한다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 0, total: 0});
    mockGetSeedHistory.mockResolvedValue({
      rewardHistory: [],
      pageInfo: {page: 0, totalPages: 1},
    });

    const {getByTestId} = render(<SeedsContainer />);

    await waitFor(() => {
      expect(mockGetSeedBalance).toHaveBeenCalled();
      expect(mockGetSeedHistory).toHaveBeenCalledWith(0);
    });

    await waitFor(() => {
      expect(getByTestId('history-count')).toHaveTextContent('0');
    });
  });

  it('스크롤 끝 이벤트 발생 시 추가 내역을 불러온다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 100, total: 200});
    mockGetSeedHistory
      .mockResolvedValueOnce({
        rewardHistory: [
          {
            id: 1,
            amount: 10,
            type: '적립',
            description: '테스트',
            balanceSnapshot: 110,
            createdAt: '2024-01-01',
          },
        ],
        pageInfo: {page: 0, totalPages: 2},
      })
      .mockResolvedValueOnce({
        rewardHistory: [
          {
            id: 2,
            amount: 20,
            type: '적립',
            description: '추가',
            balanceSnapshot: 130,
            createdAt: '2024-01-02',
          },
        ],
        pageInfo: {page: 1, totalPages: 2},
      });

    const {getByTestId} = render(<SeedsContainer />);

    // 초기 로딩 완료 대기 - 첫 번째 호출은 초기 데이터 로딩
    await waitFor(() => {
      expect(mockGetSeedHistory).toHaveBeenCalledWith(0);
    });

    // 스크롤 끝 이벤트 발생 (page=1로 호출되어야 함)
    fireEvent.press(getByTestId('scroll-end-btn'));

    await waitFor(() => {
      expect(mockGetSeedHistory).toHaveBeenCalledWith(1);
    });

    // 추가 데이터가 로드되어 총 2개가 되는지 확인
    await waitFor(() => {
      expect(getByTestId('history-count')).toHaveTextContent('2');
    });
  });

  it('로딩 상태가 올바르게 표시된다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 100, total: 200});
    // 첫 번째 호출은 즉시 해결, 두 번째 호출은 지연
    mockGetSeedHistory
      .mockResolvedValueOnce({
        rewardHistory: [],
        pageInfo: {page: 0, totalPages: 2},
      })
      .mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  rewardHistory: [
                    {
                      id: 1,
                      amount: 10,
                      type: '적립',
                      description: '테스트',
                      balanceSnapshot: 110,
                      createdAt: '2024-01-01',
                    },
                  ],
                  pageInfo: {page: 1, totalPages: 2},
                }),
              100,
            ),
          ),
      );

    const {getByTestId, queryByTestId} = render(<SeedsContainer />);

    // 초기 로딩 완료 대기
    await waitFor(() => {
      expect(getByTestId('scroll-end-btn')).toBeTruthy();
    });

    // 스크롤 이벤트 발생 (로딩 시작)
    fireEvent.press(getByTestId('scroll-end-btn'));

    // 로딩 상태 확인
    await waitFor(() => {
      expect(getByTestId('loading')).toBeTruthy();
    });

    // 로딩 완료 대기
    await waitFor(
      () => {
        expect(queryByTestId('loading')).toBeFalsy();
      },
      {timeout: 3000},
    );
  });

  it('API 호출 실패 시에도 컴포넌트가 정상 렌더링된다', async () => {
    const balanceError = new Error('Balance fetch failed');
    const historyError = new Error('History fetch failed');

    mockGetSeedBalance.mockRejectedValue(balanceError);
    mockGetSeedHistory.mockRejectedValue(historyError);

    const {getByTestId} = render(<SeedsContainer />);

    // API 실패해도 컴포넌트는 정상 렌더링되어야 함
    await waitFor(() => {
      expect(getByTestId('balance')).toHaveTextContent('0');
      expect(getByTestId('total')).toHaveTextContent('0');
      expect(getByTestId('history-count')).toHaveTextContent('0');
    });
  });

  it('마지막 페이지에서는 추가 로딩을 하지 않는다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 100, total: 200});
    mockGetSeedHistory.mockResolvedValue({
      rewardHistory: [
        {
          id: 1,
          amount: 10,
          type: '적립',
          description: '테스트',
          balanceSnapshot: 110,
          createdAt: '2024-01-01',
        },
      ],
      pageInfo: {page: 0, totalPages: 1}, // 총 1페이지로 설정
    });

    const {getByTestId} = render(<SeedsContainer />);

    // 초기 로딩 완료 대기
    await waitFor(() => {
      expect(mockGetSeedHistory).toHaveBeenCalledWith(0);
    });

    // mock 호출 횟수 초기화
    const initialCallCount = mockGetSeedHistory.mock.calls.length;

    // 스크롤 이벤트 발생 (page=1, totalPages=1이므로 추가 로딩되지 않아야 함)
    fireEvent.press(getByTestId('scroll-end-btn'));

    // 추가 API 호출이 없는지 확인
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockGetSeedHistory.mock.calls.length).toBe(initialCallCount);
  });

  it('이미 로딩 중일 때는 중복 요청을 하지 않는다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 100, total: 200});
    mockGetSeedHistory
      .mockResolvedValueOnce({
        rewardHistory: [],
        pageInfo: {page: 0, totalPages: 3},
      })
      .mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  rewardHistory: [
                    {
                      id: 1,
                      amount: 10,
                      type: '적립',
                      description: '테스트',
                      balanceSnapshot: 110,
                      createdAt: '2024-01-01',
                    },
                  ],
                  pageInfo: {page: 1, totalPages: 3},
                }),
              100,
            ),
          ),
      );

    const {getByTestId} = render(<SeedsContainer />);

    // 초기 로딩 완료 대기
    await waitFor(() => {
      expect(getByTestId('scroll-end-btn')).toBeTruthy();
    });

    // mock 호출 횟수 초기화
    mockGetSeedHistory.mockClear();

    // 빠르게 두 번 스크롤 이벤트 발생
    fireEvent.press(getByTestId('scroll-end-btn'));
    fireEvent.press(getByTestId('scroll-end-btn'));

    // 로딩 완료 대기
    await waitFor(
      () => {
        expect(mockGetSeedHistory).toHaveBeenCalledTimes(1); // 한 번만 호출되어야 함
      },
      {timeout: 3000},
    );
  });
});
