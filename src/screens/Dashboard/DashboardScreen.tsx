import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import DrivingScoreCard, {
  DrivingScoreCardProps,
} from '../../components/Dashboard/DrivingScoreCard';
import WeeklyReportButton from '../../components/Dashboard/WeeklyReportButton';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import {DashboardResponse, HomeStackParamList} from '../../types/dashboard';
import {UserResponse} from '../../types/user';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AppText from '../../components/common/AppText';

type DashboardScreenProps = {
  drivingReportData: DrivingScoreCardProps[];
  userInfo: UserResponse;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  dashboard: DashboardResponse;
  navigation: NativeStackNavigationProp<HomeStackParamList>;
};

export default function DashboardScreen({
  drivingReportData,
  userInfo,
  isEnabled,
  setIsEnabled,
  dashboard,
  navigation,
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
