import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import TabSelector from '../../components/common/TabSelector';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import { DrivingSession, InactivityEvent } from '../../types/report';
import { ATTENTION_COLORS } from '../../theme/colors';

// 분리된 컴포넌트 불러오기
import DrivingTimePanel from '../../components/Driving/DrivingTimePanel';
import InactivityPanel from '../../components/Driving/InactivityPanel';

interface AttentionScoreReportScreenProps {
  score: number;
  selectedTab: string;
  tabs: string[];
  loading: boolean;
  drivingTimeSessions: DrivingSession[];
  inactivityEvents: InactivityEvent[];
  drivingTimeScore: number;
  inactivityScore: number;
  drivingTimeFeedback: string;
  inactivityFeedback: string;
  onTabChange: (tab: string) => void;
  onBackPress: () => void;
}

const AttentionScoreReportScreen: React.FC<AttentionScoreReportScreenProps> = ({
  score,
  selectedTab,
  tabs,
  loading,
  drivingTimeSessions,
  inactivityEvents,
  drivingTimeScore,
  inactivityScore,
  drivingTimeFeedback,
  inactivityFeedback,
  onTabChange,
  onBackPress,
}) => {
  // 현재 탭에 따른 피드백 설정
  const currentFeedback = selectedTab === '운전 시간'
    ? drivingTimeFeedback
    : inactivityFeedback;

  // 선택된 탭에 따라 적절한 패널 컴포넌트 렌더링
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ATTENTION_COLORS.primary} />
        </View>
      );
    }
    
    if (selectedTab === '운전 시간') {
      return (
        <DrivingTimePanel
          session={drivingTimeSessions[0]}
          score={drivingTimeScore}
          colors={ATTENTION_COLORS}
        />
      );
    } else {
      return (
        <InactivityPanel
          events={inactivityEvents}
          score={inactivityScore}
          colors={ATTENTION_COLORS}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 및 게이지 차트 */}
        <ReportHeaderSection 
          score={score} 
          onBackPress={onBackPress} 
          screenType="attention" 
        />

        {/* 탭 선택기 */}
        <TabSelector
          options={tabs}
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          primaryColor={ATTENTION_COLORS.primary}
        />

        {/* 선택된 탭 컨텐츠 */}
        <View style={styles.contentContainer}>
          {renderContent()}
        </View>

        {/* 피드백 메시지 */}
        <FeedbackMessage
          title={`${selectedTab} 피드백`}
          message={currentFeedback}
          screenType="attention"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
    borderColor: '#FFF8D6', // 노란색 계열 테두리
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  }
});

export default AttentionScoreReportScreen;
