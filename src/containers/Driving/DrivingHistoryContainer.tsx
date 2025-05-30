import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import DrivingHistoryScreen from '../../screens/Driving/DrivingHistoryScreen';
import { useDrivingHistoryStore } from '../../store/drivingHistoryStore';

const DrivingHistoryContainer = () => {
  const navigation = useNavigation<any>();
  const { driveHistory, fetchDriveHistory, isLoading, error } = useDrivingHistoryStore();
  
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
  
  return (
    <DrivingHistoryScreen 
      driveHistory={driveHistory}
      handleDriveItemPress={handleDriveItemPress}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default DrivingHistoryContainer;