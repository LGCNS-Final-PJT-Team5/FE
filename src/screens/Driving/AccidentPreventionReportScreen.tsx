import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { ACCIDENT_COLORS } from '../../theme/colors';

// 기존 컴포넌트 활용
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import TabSelector from '../../components/common/TabSelector';
import ReactionSpeedChart from '../../components/Driving/ReactionSpeedChart';
import LaneDepartureChart from '../../components/Driving/LaneDepartureChart';
import SafeDistanceChart from '../../components/Driving/SafeDistanceChart';
import EventsList from '../../components/Driving/EventsList';
import Icon from 'react-native-vector-icons/Feather';

interface AccidentPreventionReportScreenProps {
  score: number;
  selected: string;
  tabs: string[];
  loading: boolean;
  reactionEvents: any[];
  laneDepartureEvents: any[];
  followingDistanceEvents: any[];
  reactionScore: number;
  laneDepartureScore: number;
  followingDistanceScore: number;
  currentFeedback: string;
  onTabChange: (tab: string) => void;
  onBackPress: () => void;
  driveStartTime: string; // 주행 시작 시간
  driveEndTime: string;   // 주행 종료 시간
}

const AccidentPreventionReportScreen: React.FC<AccidentPreventionReportScreenProps> = ({
  score,
  selected,
  tabs,
  loading,
  reactionEvents,
  laneDepartureEvents,
  followingDistanceEvents,
  reactionScore,
  laneDepartureScore,
  followingDistanceScore,
  currentFeedback,
  onTabChange,
  onBackPress,
  driveStartTime,
  driveEndTime
}) => {
  
  // 반응속도 탭 렌더링
  const renderReactionContent = () => {
    const scoreColor = reactionScore < 50 ? ACCIDENT_COLORS.chart.red : ACCIDENT_COLORS.chart.purple;
    const scoreText = reactionScore.toFixed(1);
    const eventsCount = reactionEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          감지된 느린 반응 이벤트: {eventsCount}회
        </Text>

        {/* 반응 속도 차트 컴포넌트 활용 */}
        <ReactionSpeedChart 
          events={reactionEvents} 
          height={200}
          score={reactionScore}
          driveStartTime={driveStartTime} // 추가: 주행 시작 시간 전달
          driveEndTime={driveEndTime}     // 추가: 주행 종료 시간 전달 
        />
        
        {/* 이벤트 목록 컴포넌트 활용 */}
        <EventsList 
          events={reactionEvents} 
          title="반응 지연 감지 시간" 
          showDuration={true}
          maxVisibleItems={10} // 추가: 한 번에 표시할 최대 아이템 수 제한
        />
      </View>
    );
  };

  // 차선이탈 탭 렌더링
  const renderLaneDepartureContent = () => {
    const scoreColor = laneDepartureScore < 50 ? ACCIDENT_COLORS.chart.red : ACCIDENT_COLORS.chart.purple;
    const scoreText = laneDepartureScore.toFixed(1);
    const eventsCount = laneDepartureEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          감지된 차선 이탈: {eventsCount}회
        </Text>

        {/* 차선 이탈 차트 컴포넌트 활용 */}
        <LaneDepartureChart events={laneDepartureEvents} height={200} />
        
        {/* 이벤트 목록 컴포넌트 활용 */}
        <EventsList 
          events={laneDepartureEvents} 
          title="차선 이탈 시간" 
          showDuration={false} 
        />
        
        <View style={styles.infoBox}>
          <Icon name="info" size={20} color={ACCIDENT_COLORS.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            차선 이탈은 피로 운전, 주의력 산만, 또는 부적절한 스티어링 조작으로 인해 발생할 수 있습니다.
            정기적인 휴식과 집중력 유지가 중요합니다.
          </Text>
        </View>
      </View>
    );
  };

  // 안전거리유지 탭 렌더링
  const renderFollowingDistanceContent = () => {
    const scoreColor = followingDistanceScore < 50 ? ACCIDENT_COLORS.chart.red : ACCIDENT_COLORS.chart.purple;
    const scoreText = followingDistanceScore.toFixed(1);
    const eventsCount = followingDistanceEvents.length;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          안전거리 미준수: {eventsCount}회
        </Text>

        {/* 안전거리 차트 컴포넌트 활용 */}
        <SafeDistanceChart events={followingDistanceEvents} height={200} />
        
        {/* 이벤트 목록 컴포넌트 활용 */}
        <EventsList 
          events={followingDistanceEvents} 
          title="안전거리 위반 감지 시간" 
          showDuration={true} 
        />
      </View>
    );
  };

  // 선택된 탭에 따른 컨텐츠 렌더링
  const renderContent = () => {
    switch (selected) {
      case '반응속도':
        return renderReactionContent();
      case '차선이탈':
        return renderLaneDepartureContent();
      case '안전거리유지':
        return renderFollowingDistanceContent();
      default:
        return renderReactionContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 및 게이지 차트 - 리포트 헤더 섹션 컴포넌트 활용 */}
        <ReportHeaderSection 
          score={score} 
          onBackPress={onBackPress}
          screenType="accident" 
        />

        {/* 탭 선택기 - 탭 셀렉터 컴포넌트 활용 */}
        <TabSelector
          options={tabs}
          selectedTab={selected}
          onTabChange={onTabChange}
          primaryColor={ACCIDENT_COLORS.primary}
        />

        {/* 선택된 탭 컨텐츠 */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>데이터를 불러오는 중...</Text>
            </View>
          ) : (
            renderContent()
          )}
        </View>

        {/* 피드백 메시지 - 피드백 메시지 컴포넌트 활용 */}
        <FeedbackMessage
          title={`${selected} 피드백`}
          message={currentFeedback}
          screenType="accident"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  contentContainer: {
    padding: 16,
    marginTop: 16,
    borderRadius: 16,
    marginHorizontal: 0,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#EBDBF5',
  },
  contentBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  contentScore: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 16,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  contentDesc: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginTop: 24,
    backgroundColor: 'rgba(187, 39, 255, 0.08)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: ACCIDENT_COLORS.primary,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: ACCIDENT_COLORS.text.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  }
});

export default AccidentPreventionReportScreen;
