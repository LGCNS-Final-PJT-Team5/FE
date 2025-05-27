import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CarbonEmissionReportScreen from '../../screens/Driving/CarbonEmissionReportScreen';
import { CARBON_COLORS } from '../../theme/colors';
import useEcoReportStore from '../../store/useEcoReportStore';

// 탭 옵션
const TABS = ['공회전', '정속주행비율'];

/**
 * 탄소 배출 보고서 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const CarbonEmissionReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(TABS[0]);
  
  // 상태값들
  const [score, setScore] = useState(0);
  const [idlingScore, setIdlingScore] = useState(0);
  const [speedMaintainScore, setSpeedMaintainScore] = useState(0);
  const [idlingEvents, setIdlingEvents] = useState([]);
  const [speedMaintainData, setSpeedMaintainData] = useState([]);
  const [totalIdlingMinutes, setTotalIdlingMinutes] = useState(0);
  const [idlingFeedback, setIdlingFeedback] = useState('');
  const [speedMaintainFeedback, setSpeedMaintainFeedback] = useState('');
  
  // Zustand 스토어에서 데이터 가져오기
  const { data, loading, error, fetchEcoReport } = useEcoReportStore();
  
  // driveId는 route params에서 가져오거나 기본값 사용
  const driveId = route.params?.driveId || '1';

  // API 데이터 가져오기
  useEffect(() => {
    fetchEcoReport(driveId);
  }, [driveId]);

  // API 데이터 처리
  useEffect(() => {
    if (data) {
      // 기본 점수 데이터 설정
      setScore(data.score);
      setIdlingScore(data.idling.score);
      setSpeedMaintainScore(data.speedMaintain.score);
      setIdlingFeedback(data.idling.feedback);
      setSpeedMaintainFeedback(data.speedMaintain.feedback);
      
      // 공회전 이벤트 처리
      const processedIdlingEvents = data.idling.graph.map((item, index) => {
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        
        return {
          id: index.toString(),
          label: `구간 ${index + 1}`,
          startTime: formatTime(item.startTime),
          endTime: formatTime(item.endTime),
          duration: durationMinutes,
          value: durationMinutes,
        };
      });
      
      setIdlingEvents(processedIdlingEvents);
      setTotalIdlingMinutes(
        Number(processedIdlingEvents.reduce((sum, item) => sum + item.duration, 0).toFixed(1))
      );
      
      // 정속 주행 데이터 처리
      const tagMapping = { 'high': '고속', 'middle': '중속', 'low': '저속' };
      const colorMapping = {
        'high': CARBON_COLORS.chart.highSpeed,
        'middle': CARBON_COLORS.chart.midSpeed,
        'low': CARBON_COLORS.chart.lowSpeed
      };
      
      const processedSpeedData = data.speedMaintain.graph.map(item => ({
        value: item.ratio,
        label: tagMapping[item.tag] || item.tag,
        color: colorMapping[item.tag] || CARBON_COLORS.primary,
      }));
      
      setSpeedMaintainData(processedSpeedData);
    }
  }, [data]);

  // 시간 포맷팅 함수
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 탭 선택 핸들러
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러 
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <CarbonEmissionReportScreen
      score={score}
      selectedTab={selectedTab}
      tabs={TABS}
      loading={loading}
      idlingEvents={idlingEvents}
      speedMaintainData={speedMaintainData}
      idlingScore={idlingScore}
      speedMaintainScore={speedMaintainScore}
      idlingFeedback={idlingFeedback}
      speedMaintainFeedback={speedMaintainFeedback}
      totalIdlingMinutes={totalIdlingMinutes}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
      error={error}
    />
  );
};

export default CarbonEmissionReportContainer;