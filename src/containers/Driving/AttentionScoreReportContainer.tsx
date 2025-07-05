import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import AttentionScoreReportScreen from '../../screens/Driving/AttentionScoreReportScreen';
import { 
  ProcessedAttentionReport, 
  DrivingSession,
  InactivityEvent 
} from '../../types/report';
import useAttentionReportStore from '../../store/useAttentionReportStore';

// 탭 옵션
const TABS = ['운전 시간', '미조작 시간'];

/**
 * 주의력 점수 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const AttentionScoreReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  const [reportData, setReportData] = useState<ProcessedAttentionReport | null>(null);

  // driveId는 route params에서 가져오거나 기본값 사용
  const driveId = route.params?.driveId || '1';

  // Zustand 스토어에서 데이터 가져오기
  const { data, loading, error, fetchAttentionReport } = useAttentionReportStore();

  // API 호출 및 데이터 가져오기
  useEffect(() => {
    fetchAttentionReport(driveId);
  }, [driveId]);

  // API 데이터 처리
  useEffect(() => {
    if (data) {
      const processedData = processReportData(data);
      setReportData(processedData);
    }
  }, [data]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 시간 포맷팅 함수
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 시간 계산 함수 (분 단위)
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  };

  // 데이터 가공
  const processReportData = (apiData: any): ProcessedAttentionReport => {
    // 운전 시간 데이터 준비
    const drivingTimeSessions: DrivingSession[] = apiData.drivingTime.graph.map((session: any, index: number) => {
      const durationMinutes = calculateDuration(session.startTime, session.endTime);
      const durationHours = durationMinutes / 60;
      
      return {
        id: index,
        startTime: session.startTime,
        endTime: session.endTime,
        formattedStartTime: formatTime(session.startTime),
        formattedEndTime: formatTime(session.endTime),
        durationMinutes,
        durationHours,
        // 2시간 기준으로 진행률 계산 (권장 최대 연속 운전 시간)
        progress: Math.min(durationHours / 2, 1)
      };
    });
    
    // 미조작 시간 이벤트 데이터 준비
    const inactivityEvents: InactivityEvent[] = apiData.inactivity.graph.map((time: string, index: number) => {
      return {
        id: index,
        time,
        formattedTime: formatTime(time)
      };
    });

    return {
      score: apiData.score,
      drivingTimeScore: apiData.drivingTime.score,
      inactivityScore: apiData.inactivity.score,
      drivingTimeFeedback: apiData.drivingTime.feedback,
      inactivityFeedback: apiData.inactivity.feedback,
      drivingTimeSessions,
      inactivityEvents
    };
  };

  // 로딩 중이거나 데이터가 없으면 로딩 표시
  if (loading || !reportData) {
    return (
      <AttentionScoreReportScreen
        score={0}
        selectedTab={selectedTab}
        tabs={TABS}
        loading={true}
        drivingTimeSessions={[]}
        inactivityEvents={[]}
        drivingTimeScore={0}
        inactivityScore={0}
        drivingTimeFeedback=""
        inactivityFeedback=""
        onTabChange={handleTabChange}
        onBackPress={handleBackPress}
      />
    );
  }

  // 스크린 컴포넌트에 데이터와 핸들러 전달
  return (
    <AttentionScoreReportScreen
      score={reportData.score}
      selectedTab={selectedTab}
      tabs={TABS}
      loading={false}
      drivingTimeSessions={reportData.drivingTimeSessions}
      inactivityEvents={reportData.inactivityEvents}
      drivingTimeScore={reportData.drivingTimeScore}
      inactivityScore={reportData.inactivityScore}
      drivingTimeFeedback={reportData.drivingTimeFeedback}
      inactivityFeedback={reportData.inactivityFeedback}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default AttentionScoreReportContainer;