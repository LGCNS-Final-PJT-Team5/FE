import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { CARBON_COLORS } from '../../theme/colors';
import { IdlingEvent, SpeedMaintainItem } from '../../types/report';
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import TabSelector from '../../components/common/TabSelector';
import IdlingBarChart from '../../components/Driving/IdlingBarChart';
import SpeedDistributionPieChart from '../../components/Driving/SpeedDistributionPieChart';

interface CarbonEmissionReportScreenProps {
  score: number;
  selectedTab: string;
  tabs: string[];
  loading: boolean;
  idlingEvents: IdlingEvent[];
  speedMaintainData: SpeedMaintainItem[];
  idlingScore: number;
  speedMaintainScore: number;
  idlingFeedback: string;
  speedMaintainFeedback: string;
  totalIdlingMinutes: number;
  error: string | null;
  onTabChange: (tab: string) => void;
  onBackPress: () => void;
}

const CarbonEmissionReportScreen: React.FC<CarbonEmissionReportScreenProps> = ({
  score,
  selectedTab,
  tabs,
  loading,
  idlingEvents,
  speedMaintainData,
  idlingScore,
  speedMaintainScore,
  idlingFeedback,
  speedMaintainFeedback,
  totalIdlingMinutes,
  error,
  onTabChange,
  onBackPress
}) => {
  // 현재 탭에 따른 점수 및 피드백
  const currentScore = selectedTab === '공회전'
    ? idlingScore
    : speedMaintainScore;

  const currentFeedback = selectedTab === '공회전'
    ? idlingFeedback
    : speedMaintainFeedback;
  
  // 점수에 따른 색상
  const scoreColor = currentScore < 50 ? CARBON_COLORS.chart.red : CARBON_COLORS.chart.blue;

  // 공회전 탭 렌더링
  const renderIdlingContent = () => {
    const scoreText = idlingScore.toFixed(1);
    
    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          총 공회전 시간: {totalIdlingMinutes} 분
        </Text>

        {/* 분리된 IdlingBarChart 컴포넌트 사용 */}
        <IdlingBarChart 
          events={idlingEvents} 
          title="공회전 시간대 분석" 
        />
      </View>
    );
  };

  // 정속주행비율 탭 렌더링
  const renderSpeedMaintainContent = () => {
    const scoreText = speedMaintainScore.toFixed(1);
    const middleSpeedRatio = speedMaintainData.find(item => item.label === '중속')?.value ?? 0;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          정속 주행 비율: {middleSpeedRatio}%
        </Text>

        {/* 분리된 SpeedDistributionPieChart 컴포넌트 사용 */}
        <SpeedDistributionPieChart 
          data={speedMaintainData}
          title="속도 유지 비율 분석"
          pieRadius={screenWidth * 0.35}
          pieInnerRadius={screenWidth * 0.18}
        />
      </View>
    );
  };

  // 선택된 탭 컨텐츠 렌더링
  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error}
          </Text>
          <Text style={styles.errorSubText}>
            네트워크 연결을 확인하고 다시 시도해주세요.
          </Text>
        </View>
      );
    }
    
    switch (selectedTab) {
      case '공회전':
        return renderIdlingContent();
      case '정속주행비율':
        return renderSpeedMaintainContent();
      default:
        return renderIdlingContent();
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
          screenType="carbon" 
        />
        
        {/* 탭 선택기 */}
        <TabSelector
          options={tabs}
          selectedTab={selectedTab}
          onTabChange={onTabChange}
          primaryColor={CARBON_COLORS.primary}
        />

        {/* 선택된 탭 컨텐츠 */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={CARBON_COLORS.primary} />
              <Text style={styles.loadingText}>
                데이터를 불러오는 중입니다...
              </Text>
            </View>
          ) : (
            renderContent()
          )}
        </View>

        {/* 피드백 메시지 */}
        <FeedbackMessage
          title={`${selectedTab} 피드백`}
          message={currentFeedback}
          screenType="carbon"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// 화면 크기 계산 (Dimensions import 필요)
import { Dimensions } from 'react-native';
const screenWidth = Dimensions.get('window').width;

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
    borderColor: '#CCE4FF',
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
    color: CARBON_COLORS.text.secondary,
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  errorText: {
    fontSize: 16,
    color: CARBON_COLORS.error,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});

export default CarbonEmissionReportScreen;
