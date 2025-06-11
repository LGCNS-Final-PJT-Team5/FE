import React, {useEffect, useState} from 'react';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DashboardResponse, HomeStackParamList} from '../../types/dashboard';
import {UserResponse} from '../../types/user';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import DashboardScreen from '../../screens/Dashboard/DashboardScreen';
import {useUserStore} from '../../store/useUserStore';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {dashboardService} from '../../services/api/dashboardService';
import {logout} from '@react-native-seoul/kakao-login';

export default function DashboardContainer() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const user = useUserStore(state => state.user);

  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboard();
      console.log('대시보드 데이터 성공:', data);
      setDashboard(data);
    } catch (error) {
      console.warn('대시보드 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('user 상태:', user);

    if (user) {
      setUserInfo(user);
      setIsEnabled(user.alarm);
      fetchDashboard();
    } else {
      // user가 없으면 로그인 화면으로
      setLoading(false);
      logout();
    }
  }, [user]);

  // 탭 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        fetchDashboard();
      }
    }, [user])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>
          대시보드 정보를 불러오는 중입니다.
        </Text>
      </View>
    );
  }

  if (!userInfo || !dashboard) {
    return null;
  }

  const formatScore = (score: number) => {
    return typeof score === 'number' ? Number(score.toFixed(2)) : score;
  };

  const drivingReportData = [
    {
      title: '탄소 배출 및 연비 점수',
      color: '#1E40AF',
      backgroundColor: '#EFF6FF',
      textColor: '#1E40AF',
      score: formatScore(dashboard.scores.ecoScore),
      data: [
        {
          value: formatScore(dashboard.scores.idlingScore),
          color: '#3B82F6',
          label: {text: '공회전'},
        },
        {
          value: formatScore(dashboard.scores.speedMaintainScore),
          color: '#60A5FA',
          label: {text: '정속주행 비율'},
        },
      ],
    },
    {
      title: '안전 운전 점수',
      color: '#166534',
      backgroundColor: '#F0FDF4',
      textColor: '#166534',
      score: formatScore(dashboard.scores.safetyScore),
      data: [
        {
          value: formatScore(dashboard.scores.accelerationScore),
          color: '#22C55E',
          label: {text: '급가/감속'},
        },
        {
          value: formatScore(dashboard.scores.sharpTurnScore),
          color: '#4ADE80',
          label: {text: '급회전'},
        },
        {
          value: formatScore(dashboard.scores.overSpeedScore),
          color: '#86EFAC',
          label: {text: '과속'},
        },
      ],
    },
    {
      title: '사고 예방 점수',
      color: '#7C2D92',
      backgroundColor: '#FAF5FF',
      textColor: '#7C2D92',
      score: formatScore(dashboard.scores.accidentPreventionScore),
      data: [
        {
          value: formatScore(dashboard.scores.reactionScore),
          color: '#A855F7',
          label: {text: '반응 속도'},
        },
        {
          value: formatScore(dashboard.scores.laneDepartureScore),
          color: '#C084FC',
          label: {text: '차선이탈'},
        },
        {
          value: formatScore(dashboard.scores.followingDistanceScore),
          color: '#DDD6FE',
          label: {text: '안전거리 유지'},
        },
      ],
    },
    {
      title: '주의력 점수',
      color: '#A16207',
      backgroundColor: '#FFFBEB',
      textColor: '#A16207',
      score: formatScore(dashboard.scores.attentionScore),
      data: [
        {
          value: formatScore(dashboard.scores.drivingTimeScore),
          color: '#EAB308',
          label: {text: '운전시간'},
        },
        {
          value: formatScore(dashboard.scores.inactivityScore),
          color: '#FDE047',
          label: {text: '미조작 시간'},
        },
      ],
    },
  ];

  return (
    <DashboardScreen
      drivingReportData={drivingReportData}
      userInfo={userInfo}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      dashboard={dashboard}
      navigation={navigation}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
});