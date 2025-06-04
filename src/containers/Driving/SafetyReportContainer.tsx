import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import SafetyReportScreen from '../../screens/Driving/SafetyReportScreen';
import { processSafetyData } from '../../utils/chartDataProcessor';
import useSafetyReportStore from '../../store/useSafetyReportStore';

const TAB_OPTIONS = ['급가감속', '급회전', '과속'];

/**
 * 안전 운전 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const SafetyReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState(TAB_OPTIONS[0]);
  const [safetyData, setSafetyData] = useState(null);
  const [formattedBarData, setFormattedBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [formattedLineData, setFormattedLineData] = useState([]);

  // driveId는 route params에서 가져오거나 기본값 사용
  const driveId = route.params?.driveId || '1';

  // Zustand 스토어에서 데이터 가져오기
  const { data, loading, error, fetchSafetyReport } = useSafetyReportStore();

  // API 데이터 가져오기
  useEffect(() => {
    fetchSafetyReport(driveId);
  }, [driveId]);

  // API 데이터 처리
  useEffect(() => {
    if (data) {
      // 급가속/정상가속 개수 계산
      const highAccelerationCount = data.acceleration.graph.filter(item => item.flag).length;
      const normalAccelerationCount = data.acceleration.graph.filter(item => !item.flag).length;
      const totalEvents = data.acceleration.graph.length;
      
      const processedData = {
        score: data.score,
        acceleration: {
          score: data.acceleration.score,
          title: '급가감속 분석',
          feedback: data.acceleration.feedback,
          // 점수 계산 공식 표시용 데이터
          statistics: {
            totalEvents: totalEvents,
            highAcceleration: highAccelerationCount,
            normalAcceleration: normalAccelerationCount,
            // 점수 계산 공식: 100 * 정상가속 / (정상가속 + 급가속)
            formula: {
              normal: normalAccelerationCount,
              high: highAccelerationCount,
              calculated: normalAccelerationCount > 0 ? 
                Math.round(100 * normalAccelerationCount / totalEvents) : 0
            }
          },
          // 급가속/급감속 발생 시간을 차트 데이터로 변환
          chartData: data.acceleration.graph.map((item) => {
            const date = new Date(item.time);
            const isRapid = item.flag;
            
            return {
              value: isRapid ? 85 : 60, // 급가속은 더 높은 값, 정상가속은 낮은 값
              label: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
              barWidth: 30,
              frontColor: isRapid ? '#E53E3E' : '#4CAF50', // 급가속: 빨강, 정상가속: 초록
              accelerationType: isRapid ? '급가속' : '정상가속',
              time: item.time
            };
          })
        },
        turning: {
          score: data.sharpTurn.score,
          title: '급회전 분석',
          feedback: data.sharpTurn.feedback,
          safeRatio: Math.round(data.sharpTurn.score),
          chartData: {
            safe: Math.round(data.sharpTurn.score),
            unsafe: 100 - Math.round(data.sharpTurn.score)
          }
        },
        speeding: {
          score: data.overSpeed.score,
          title: '과속 분석',
          feedback: data.overSpeed.feedback,
          violations: data.overSpeed.score < 100 ? Math.round((100 - data.overSpeed.score) / 10) : 0,
          speedLimit: 100,
          chartData: data.overSpeed.graph.map(item => ({
            value: item.maxSpeed,
            label: `구간 ${item.period}`
          }))
        }
      };

      // 차트 데이터 처리
      const { 
        processedData: finalProcessedData,
        formattedBarData,
        pieData,
        formattedLineData 
      } = processSafetyData(processedData);

      setSafetyData(finalProcessedData);
      setFormattedBarData(formattedBarData);
      setPieData(pieData);
      setFormattedLineData(formattedLineData);
    }
  }, [data]);

  // 탭 선택 핸들러
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafetyReportScreen
      safetyData={safetyData || {
        score: 0,
        acceleration: { score: 0, title: '', feedback: '' },
        turning: { score: 0, title: '', feedback: '', safeRatio: 0 },
        speeding: { score: 0, title: '', feedback: '', violations: 0, speedLimit: 0 }
      }}
      selectedTab={selectedTab}
      options={TAB_OPTIONS}
      loading={loading}
      formattedBarData={formattedBarData}
      pieData={pieData}
      formattedLineData={formattedLineData}
      onTabSelect={handleTabSelect}
      onBackPress={handleBackPress}
    />
  );
};

export default SafetyReportContainer;