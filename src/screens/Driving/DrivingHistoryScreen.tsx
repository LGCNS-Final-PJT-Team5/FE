import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import DrivingHistoryItem from '../../components/Driving/DrivingHistoryItem';
import DrivingHistoryChart from '../../components/Driving/DrivingHistoryChart';
import { DriveHistoryItem } from '../../types/driving';
import { colors } from '../../theme/colors';

interface DrivingHistoryScreenProps {
  driveHistory: DriveHistoryItem[];
  handleDriveItemPress: (driveId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const DrivingHistoryScreen: React.FC<DrivingHistoryScreenProps> = ({ 
  driveHistory = [], // 기본값 제공 
  handleDriveItemPress, 
  isLoading, 
  error 
}) => {
  // 로딩 및 에러 처리 추가
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.container}>   
        <Text style={styles.title}>주행 히스토리</Text>
        <Text style={styles.subtitle}>지금까지의 주행 데이터를 확인해 보세요</Text>
        
        {(driveHistory?.length ?? 0) === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 주행 기록이 없어요</Text>
          </View>
        )}
        
        <DrivingHistoryChart />
        
        <View style={styles.listHeaderContainer}>
          <Text style={styles.listHeaderLeft}>주행일시</Text>
          <Text style={styles.listHeaderRight}>주행점수</Text>
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
            )
            }
            keyExtractor={item => item.driveId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContentContainer}
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
    fontFamily: 'Pretendard-Bold',
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontFamily: 'Pretendard-Regular',
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
    fontFamily: 'Pretendard-Medium',
    fontSize: 15,
    color: '#000000',
    marginLeft: 77,
  },
  listHeaderRight: {
    fontFamily: 'Pretendard-Medium',
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