import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import SeedsScreen from '../../screens/Seeds/SeedsScreen';
import {SeedHistoryRawItem} from '../../types/seeds';
import {seedsService} from '../../services/api/seedsService';

export default function SeedsContainer() {
  const [seeds, setSeeds] = useState({balance: 0, total: 0});
  const [history, setHistory] = useState<SeedHistoryRawItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchSeedBalance = async () => {
    try {
      const res = await seedsService.getSeedBalance();
      setSeeds({balance: res.balance, total: res.total});
    } catch (error) {
      console.log('씨앗 잔액 조회 실패:', error);
    }
  };

  const fetchSeedHistory = useCallback(async () => {
    if (loading || page >= totalPages) return;

    setLoading(true);
    try {
      const res = await seedsService.getSeedHistory(page);
      const {rewardHistory, pageInfo} = res;

      setHistory(prev => [...prev, ...rewardHistory]);
      setPage(pageInfo.page + 1);
      setTotalPages(pageInfo.totalPages);
    } catch (error) {
      console.log('씨앗 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  }, [page, totalPages, loading]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const init = async () => {
        await fetchSeedBalance();

        // 초기 로딩과 스크롤 로딩을 분리
        const res = await seedsService.getSeedHistory(0);
        if (!isActive) return;

        const {rewardHistory, pageInfo} = res;
        setHistory(rewardHistory);
        setPage(1);
        setTotalPages(pageInfo.totalPages);
      };

      init();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SeedsScreen
      seeds={seeds}
      seedsHistory={history}
      loading={loading}
      onScrollEnd={fetchSeedHistory}
    />
  );
}
