import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import AccidentPreventionReportScreen from '../../screens/Driving/AccidentPreventionReportScreen';
import useAccidentPreventionStore from '../../store/useAccidentPreventionStore';

// 탭 옵션
const TABS = ['반응속도', '차선이탈', '안전거리유지'];

/**
 * 사고 예방 리포트 컨테이너 컴포넌트 - 데이터와 상태 관리 담당
 */
const AccidentPreventionReportContainer: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selected, setSelected] = useState(TABS[0]);
  
  // 이벤트 데이터
  const [reactionEvents, setReactionEvents] = useState<any[]>([]);
  const [laneDepartureEvents, setLaneDepartureEvents] = useState<any[]>([]);
  const [followingDistanceEvents, setFollowingDistanceEvents] = useState<any[]>([]);
  
  // 점수 및 피드백
  const [totalScore, setTotalScore] = useState(0);
  const [reactionScore, setReactionScore] = useState(0);
  const [laneDepartureScore, setLaneDepartureScore] = useState(0);
  const [followingDistanceScore, setFollowingDistanceScore] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState('');
  
  // driveId는 route params에서 가져오거나 기본값 사용
  const driveId = route.params?.driveId || '1';

  // Zustand 스토어에서 데이터 가져오기
  const { data, loading, error, fetchAccidentPreventionReport } = useAccidentPreventionStore();

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchAccidentPreventionReport(driveId);
  }, [driveId]);

  // API 데이터 처리
  useEffect(() => {
    if (data) {
      setTotalScore(data.score);
      setReactionScore(data.reaction.score);
      setLaneDepartureScore(data.laneDeparture.score);
      setFollowingDistanceScore(data.followingDistance.score);
      
      // 탭 선택에 따른 피드백 설정
      updateFeedback(selected, data);
      
      // 반응속도 이벤트 데이터 처리
      if (data.reaction.graph) {
        const formattedReactionEvents = data.reaction.graph.map((time, index) => {
          const date = new Date(time);
          return {
            id: index,
            time: date,
            formattedTime: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
            value: Math.random() * 2 + 1 // 임의 반응 시간 (1~3초)
          };
        });
        setReactionEvents(formattedReactionEvents);
      } else {
        setReactionEvents([]);
      }
      
      // 차선이탈 이벤트 데이터 처리
      if (data.laneDeparture.graph) {
        const formattedLaneDepartureEvents = data.laneDeparture.graph.map((time, index) => {
          const date = new Date(time);
          return {
            id: index,
            time: date,
            formattedTime: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
            side: Math.random() > 0.5 ? '좌측' : '우측' // 임의 이탈 방향
          };
        });
        setLaneDepartureEvents(formattedLaneDepartureEvents);
      } else {
        setLaneDepartureEvents([]);
      }
      
      // 안전거리 이벤트 데이터 처리
      if (data.followingDistance.graph) {
        const formattedFollowingDistanceEvents = data.followingDistance.graph.map((time, index) => {
          const date = new Date(time);
          return {
            id: index,
            time: date,
            formattedTime: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
            distance: Math.random() * 10 + 5 // 임의 거리 (5~15m)
          };
        });
        setFollowingDistanceEvents(formattedFollowingDistanceEvents);
      } else {
        setFollowingDistanceEvents([]);
      }
    }
  }, [data, selected]);

  // 피드백 업데이트
  const updateFeedback = (tab: string, reportData: any) => {
    if (!reportData) return;
    
    switch (tab) {
      case '반응속도':
        setCurrentFeedback(reportData.reaction.feedback);
        break;
      case '차선이탈':
        setCurrentFeedback(reportData.laneDeparture.feedback);
        break;
      case '안전거리유지':
        setCurrentFeedback(reportData.followingDistance.feedback);
        break;
      default:
        setCurrentFeedback('');
    }
  };

  // 탭 선택 핸들러
  const handleTabChange = (tab: string) => {
    setSelected(tab);
    if (data) {
      updateFeedback(tab, data);
    }
  };

  // 뒤로가기 핸들러
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <AccidentPreventionReportScreen 
      score={totalScore}
      selected={selected}
      tabs={TABS}
      loading={loading}
      reactionEvents={reactionEvents}
      laneDepartureEvents={laneDepartureEvents}
      followingDistanceEvents={followingDistanceEvents}
      reactionScore={reactionScore}
      laneDepartureScore={laneDepartureScore}
      followingDistanceScore={followingDistanceScore}
      currentFeedback={currentFeedback}
      onTabChange={handleTabChange}
      onBackPress={handleBackPress}
    />
  );
};

export default AccidentPreventionReportContainer;