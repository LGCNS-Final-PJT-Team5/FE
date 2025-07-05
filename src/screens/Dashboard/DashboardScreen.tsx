import React from 'react';
import {StyleSheet, FlatList, RefreshControl} from 'react-native';
import DrivingScoreCard, {
  DrivingScoreCardProps,
} from '../../components/Dashboard/DrivingScoreCard';
import WeeklyReportButton from '../../components/Dashboard/WeeklyReportButton';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import {DashboardResponse, HomeStackParamList} from '../../types/dashboard';
import {UserResponse} from '../../types/user';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';

type DashboardScreenProps = {
  drivingReportData: DrivingScoreCardProps[];
  userInfo: UserResponse;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  dashboard: DashboardResponse;
  navigation: NativeStackNavigationProp<HomeStackParamList>;
  onRefresh: () => void; // 새로고침 함수 prop 추가
  refreshing: boolean;   // 새로고침 상태 prop 추가
};

export default function DashboardScreen({
  drivingReportData,
  userInfo,
  isEnabled,
  setIsEnabled,
  dashboard,
  navigation,
  onRefresh,
  refreshing
}: DashboardScreenProps) {
  return (
    <FlatList
      data={drivingReportData}
      keyExtractor={(_, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={styles.gridRow}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListHeaderComponent={
        <>
          <DashboardHeader
            userInfo={userInfo}
            isEnabled={isEnabled}
            setIsEnabled={setIsEnabled}
            dashboard={dashboard}
          />
        </>
      }
      renderItem={({item}) => <DrivingScoreCard {...item} />}
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
      ListFooterComponent={<WeeklyReportButton navigation={navigation} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
