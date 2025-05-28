import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatDate} from '../../utils/date';
import ProfileHeader from './header/ProfileHeader';
import MobtiBox from './header/MobtiBox';
import DriveInfoGroup from './header/DriveInfoBox';
import {UserResponse} from '../../types/user';
import {DashboardResponse} from '../../types/dashboard';

export type DashboardHeaderProps = {
  userInfo: UserResponse;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  dashboard: DashboardResponse;
};

export default function DashboardHeader({
  userInfo,
  isEnabled,
  setIsEnabled,
  dashboard,
}: DashboardHeaderProps) {
  const driveInfoItems = [
    {
      icon: <MaterialCommunityIcons name="calendar-month" size={15} />,
      label: '최근 운전일',
      value: isNaN(new Date(dashboard?.lastDrive ?? '').getTime())
        ? '-'
        : formatDate(dashboard!.lastDrive),
    },
    {
      icon: (
        <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={15} />
      ),
      label: '누적 운전 횟수',
      value:
        dashboard?.driveCount !== undefined && dashboard?.driveCount !== null
          ? `${dashboard.driveCount}회`
          : '-',
    },
  ];

  return (
    <>
      <ProfileHeader
        userInfo={userInfo}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
      />
      <MobtiBox dashboard={dashboard} />
      <DriveInfoGroup items={driveInfoItems} />
      <View style={styles.reportBox}>
        <Text style={styles.reportTitle}>운전 점수 리포트</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  reportBox: {
    marginTop: 40,
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});
