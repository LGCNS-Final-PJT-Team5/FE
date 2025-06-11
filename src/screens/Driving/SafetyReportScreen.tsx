import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SAFETY_COLORS } from '../../theme/colors';
import { SafetyReportScreenProps } from '../../types/report';

// 기존 컴포넌트 활용
import ReportHeaderSection from '../../components/Driving/ReportHeaderSection';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import TabSelector from '../../components/common/TabSelector';

// 새로 만든 차트 컴포넌트 활용
import AccelerationChart from '../../components/Driving/AccelerationChart';
import TurningChart from '../../components/Driving/TurningChart';
import SpeedingChart from '../../components/Driving/SpeedingChart';
import AccelerationDetailChart from '../../components/Driving/AccelerationDetailChart';

// 화면 크기 가져오기
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// 반응형 차트 크기 계산
const chartConfig = {
  pieRadius: screenWidth * 0.35,
  pieInnerRadius: screenWidth * 0.18,
  lineChartHeight: Math.max(screenHeight * 0.28, 200),
  lineChartWidth: screenWidth - 100 > 0 ? screenWidth - 100 : 300,
};

const SafetyReportScreen: React.FC<SafetyReportScreenProps> = ({
  safetyData,
  selectedTab,
  options,
  loading,
  formattedBarData,
  pieData,
  formattedLineData,
  onTabSelect,
  onBackPress
}) => {
  // 급가속/감속 탭 렌더링 함수
  const renderAccelerationContent = () => {
    const scoreColor =
      safetyData.acceleration.score < 50
        ? SAFETY_COLORS.chart.red
        : SAFETY_COLORS.chart.green;
    const scoreText = safetyData.acceleration.score.toFixed(1);

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>급가감속 점수 {scoreText}점</Text>

        {formattedBarData && formattedBarData.length > 0 ? (
          <AccelerationChart 
            data={formattedBarData} 
            title={safetyData.acceleration.title} 
            height={chartConfig.lineChartHeight} 
            count={safetyData.acceleration.count} // 급가감속 횟수 추가
          />
        ) : (
          <Text>차트 데이터가 없습니다.</Text>
        )}
      </View>
    );
  };

  // 급회전 탭 렌더링 함수
  const renderTurningContent = () => {
    const scoreColor =
      safetyData.turning.score < 50 ? SAFETY_COLORS.chart.red : SAFETY_COLORS.chart.green;
    const scoreText = safetyData.turning.score.toFixed(1);
    const safeRatioText = safetyData.turning.safeRatio;

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>안전 회전 비율 {safeRatioText}%</Text>

        <TurningChart 
          data={pieData} 
          title={safetyData.turning.title}
          pieRadius={chartConfig.pieRadius}
          pieInnerRadius={chartConfig.pieInnerRadius}
        />
      </View>
    );
  };

  // 과속 탭 렌더링 함수
  const renderSpeedingContent = () => {
    const scoreColor =
      safetyData.speeding.score < 50 ? SAFETY_COLORS.chart.red : SAFETY_COLORS.chart.green;
    const scoreText = safetyData.speeding.score.toFixed(1);

    return (
      <View style={styles.contentBlock}>
        <Text style={[styles.contentScore, {color: scoreColor}]}>
          {scoreText} 점
        </Text>
        <Text style={styles.contentDesc}>
          법정 속도 위반 횟수 {safetyData.speeding.violations}회
        </Text>

        <SpeedingChart 
          data={formattedLineData}
          title={safetyData.speeding.title}
          speedLimit={safetyData.speeding.speedLimit}
          height={chartConfig.lineChartHeight}
          width={chartConfig.lineChartWidth}
        />
      </View>
    );
  };

  // 차트 렌더링 부분
  const renderAccelerationSection = () => {
    return (
      <View style={styles.section}>
        <AccelerationDetailChart
          data={safetyData.acceleration.chartData}
          title={safetyData.acceleration.title}
          score={safetyData.acceleration.score}
          statistics={safetyData.acceleration.statistics}
          feedback={safetyData.acceleration.feedback}
        />
      </View>
    );
  };

  // 선택된 탭에 따라 적절한 컨텐츠 렌더링하는 함수
  const renderContent = () => {
    switch (selectedTab) {
      case '급가감속':
        return renderAccelerationContent();
      case '급회전':
        return renderTurningContent();
      case '과속':
        return renderSpeedingContent();
      default:
        return renderAccelerationContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 및 게이지 차트 */}
        <ReportHeaderSection 
          score={safetyData.score} 
          onBackPress={onBackPress} 
          screenType="safety" 
        />

        {/* 탭 선택기 */}
        <TabSelector
          options={options}
          selectedTab={selectedTab}
          onTabChange={onTabSelect}
          primaryColor={SAFETY_COLORS.primary}
        />

        {/* 선택된 탭의 컨텐츠 표시 */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={SAFETY_COLORS.primary} />
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
          title="운전 피드백"
          message={selectedTab === '급가감속'
            ? safetyData.acceleration.feedback
            : selectedTab === '급회전'
            ? safetyData.turning.feedback
            : safetyData.speeding.feedback}
          screenType="safety"
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
    borderColor: '#D8F7E3',
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
    color: SAFETY_COLORS.text.secondary,
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
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
});

export default SafetyReportScreen;
