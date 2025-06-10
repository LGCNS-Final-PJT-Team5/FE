import React, { useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import DrivingDetailScreen from '../../screens/Driving/DrivingDetailScreen';
import { DrivingStackParamList } from '../../types/driving';
import { useDrivingDetailStore } from '../../store/drivingDetailStore';
import { useUserStore } from '../../store/useUserStore';

type DrivingDetailNavigationProp = NativeStackNavigationProp<
  DrivingStackParamList,
  'DrivingDetail'
>;

type DrivingDetailRouteProp = RouteProp<DrivingStackParamList, 'DrivingDetail'>;

const DrivingDetailContainer: React.FC = () => {
  const navigation = useNavigation<DrivingDetailNavigationProp>();
  const route = useRoute<DrivingDetailRouteProp>();
  const { drivingId } = route.params || { drivingId: '' };
  
  const { driveDetail, isLoading, error, fetchDriveDetail } = useDrivingDetailStore();
  const { user } = useUserStore();
  const userId = user?.id || '1'; // 로그인 사용자 ID 또는 기본값

  // 카드 배경색 배열
  const cardBgColors = ['#E1F5FE', '#E8F5E9', '#F3E5F5', '#FFF3E0'];

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchDriveDetail(drivingId, userId);
  }, [drivingId, userId, fetchDriveDetail]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleCardPress = (cardName: string) => {
    // 디버깅 로그 추가
    console.log(`카드 클릭: ${cardName}, driveId: ${drivingId}`);

    switch (cardName) {
      case '안전 운전 점수':
        navigation.navigate('SafetyReport', { driveId: drivingId });
        break;
      case '탄소 배출 및 연비 점수':
        navigation.navigate('CarbonEmissionReport', { driveId: drivingId });
        break;
      case '사고 예방 점수':
        navigation.navigate('AccidentPreventionReport', { driveId: drivingId });
        break;
      case '주의력 점수':
        navigation.navigate('AttentionScoreReport', { driveId: drivingId });
        break;
    }
  };

  // 로딩 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4945FF" />
      </View>
    );
  }

  // 에러 표시
  if (error || !driveDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || '데이터를 불러올 수 없습니다.'}</Text>
      </View>
    );
  }

  return (
    <DrivingDetailScreen
      data={driveDetail}
      cardBgColors={cardBgColors}
      handleClose={handleClose}
      handleCardPress={handleCardPress}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DrivingDetailContainer;