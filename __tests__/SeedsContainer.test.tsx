import React from 'react';
import {render, waitFor, fireEvent} from '@testing-library/react-native';
import SeedsContainer from '../src/containers/Seeds/SeedsContainer';
import {NavigationContainer} from '@react-navigation/native';

jest.mock('../src/services/api/seedsService', () => ({
  seedsService: {
    getSeedBalance: jest.fn(),
    getSeedHistory: jest.fn(),
  },
}));
import {seedsService} from '../src/services/api/seedsService';

// Mock SeedsScreen
jest.mock('../src/screens/Seeds/SeedsScreen', () => {
  return jest.fn(({seeds, seedsHistory, loading, onScrollEnd}) => {
    const {Text} = require('react-native');
    return (
      <>
        {loading ? <Text>로딩중</Text> : null}
        <Text testID="balance">{seeds.balance}</Text>
        <Text testID="total">{seeds.total}</Text>
        <Text testID="history-count">{seedsHistory.length}</Text>
        <Text testID="onScrollEnd" onPress={onScrollEnd}>
          스크롤끝
        </Text>
      </>
    );
  });
});

describe('SeedsContainer', () => {
  const mockGetSeedBalance = seedsService.getSeedBalance as jest.Mock;
  const mockGetSeedHistory = seedsService.getSeedHistory as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
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

    const {getByTestId} = render(
      <NavigationContainer>
        <SeedsContainer />
      </NavigationContainer>,
    );

    await waitFor(() => {
      expect(mockGetSeedBalance).toHaveBeenCalled();
      expect(mockGetSeedHistory).toHaveBeenCalledWith(0);
      expect(getByTestId('balance').props.children).toBe(100);
      expect(getByTestId('total').props.children).toBe(200);
      expect(getByTestId('history-count').props.children).toBe(1);
    });
  });

  it('내역이 없을 때 빈 배열을 전달한다', async () => {
    mockGetSeedBalance.mockResolvedValue({balance: 0, total: 0});
    mockGetSeedHistory.mockResolvedValue({
      rewardHistory: [],
      pageInfo: {page: 0, totalPages: 1},
    });

    const {getByTestId} = render(
      <NavigationContainer>
        <SeedsContainer />
      </NavigationContainer>,
    );
    await waitFor(() => {
      expect(getByTestId('history-count').props.children).toBe(0);
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

    const {getByTestId} = render(
      <NavigationContainer>
        <SeedsContainer />
      </NavigationContainer>,
    );
    await waitFor(() => {
      expect(mockGetSeedHistory).toHaveBeenCalledWith(0);
    });

    // 스크롤 끝 이벤트 발생
    fireEvent.press(getByTestId('onScrollEnd'));

    await waitFor(() => {
      expect(mockGetSeedHistory).toHaveBeenCalledWith(1);
    });
  });
});

// 로딩 중 테스트 제외
