import React, { useEffect, useState } from 'react'; // useState 추가
import { useNavigation } from '@react-navigation/native';
import DrivingHistoryScreen from '../../screens/Driving/DrivingHistoryScreen';
import { useDrivingHistoryStore } from '../../store/drivingHistoryStore';

const DrivingHistoryContainer = () => {
  const navigation = useNavigation<any>();
  const { driveHistory, fetchDriveHistory, isLoading, error } = useDrivingHistoryStore();
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태 추가
  
  // 데이터 로드
  useEffect(() => {
    console.log('Container mounted, loading data from API...');
    fetchDriveHistory();
  }, [fetchDriveHistory]);
  
  // 주행 상세 화면으로 이동
  const handleDriveItemPress = (driveId: string) => {
    console.log('주행 기록 클릭:', driveId);
    navigation.navigate('DrivingDetail', { drivingId: driveId });
  };
  
  // 새로고침 핸들러 추가
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDriveHistory();
    setRefreshing(false);
  };
  
  return (
    <DrivingHistoryScreen 
      driveHistory={driveHistory}
      handleDriveItemPress={handleDriveItemPress}
      isLoading={isLoading}
      error={error}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );
};

export default DrivingHistoryContainer;