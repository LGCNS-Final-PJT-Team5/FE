import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  FlatList, 
  ActivityIndicator,
  RefreshControl // RefreshControl import 추가
} from 'react-native';
import DrivingHistoryItem from '../../components/Driving/DrivingHistoryItem';
import DrivingHistoryChart from '../../components/Driving/DrivingHistoryChart';
import { DriveHistoryItem } from '../../types/driving';
import { colors } from '../../theme/colors';
import AppText from '../../components/common/AppText';

interface DrivingHistoryScreenProps {
  driveHistory: DriveHistoryItem[];
  handleDriveItemPress: (driveId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void; // 새로고침 함수 prop 추가
  refreshing: boolean;   // 새로고침 상태 prop 추가
}

const DrivingHistoryScreen: React.FC<DrivingHistoryScreenProps> = ({ 
  driveHistory = [], // 기본값 제공 
  handleDriveItemPress, 
  isLoading, 
  error,
  onRefresh,
  refreshing
}) => {
  // 로딩 및 에러 처리 추가
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText style={styles.loadingText}>데이터를 불러오는 중...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <AppText style={styles.errorText}>{error}</AppText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.container}>   
        <AppText bold style={styles.title}>주행 히스토리</AppText>
        <AppText style={styles.subtitle}>지금까지의 주행 데이터를 확인해 보세요</AppText>
        
        {(driveHistory?.length ?? 0) === 0 && !isLoading && !refreshing && (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>아직 주행 기록이 없어요</AppText>
          </View>
        )}
        
        <DrivingHistoryChart />
        
        <View style={styles.listHeaderContainer}>
          <AppText style={styles.listHeaderLeft}>주행일시</AppText>
          <AppText style={styles.listHeaderRight}>주행점수</AppText>
        </View>
        
        <View style={styles.historyListContainer}>
          <View style={styles.fullTimelineLine} />
          <FlatList
            data={driveHistory ?? []}
            renderItem={({ item }) => (
              <DrivingHistoryItem 
                item={item} 
                onPress={handleDriveItemPress} 
              />
            )}
            keyExtractor={item => item.driveId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
            // 새로고침 컨트롤 추가
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]} // Android
                tintColor={colors.primary} // iOS
                title="새로고침 중..." // iOS
                titleColor={colors.neutralDark} // iOS
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    // fontFamily: 'Pretendard-Bold',
    fontSize: 34,
    // fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    // fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: colors.neutralDark,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutralDark,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  listHeaderLeft: {
    // fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    marginLeft: 77,
  },
  listHeaderRight: {
    // fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    marginRight: 20,
  },
  historyListContainer: {
    flex: 1,
  },
  fullTimelineLine: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.timelineLine,
  },
  listContentContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.neutralDark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
});

export default DrivingHistoryScreen;