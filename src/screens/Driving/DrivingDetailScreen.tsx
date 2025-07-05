import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import DetailHeader from '../../components/Driving/DetailHeader';
import ScoreCard from '../../components/Driving/ScoreCard';
import FeedbackMessage from '../../components/Driving/FeedbackMessage';
import HorizontalProgressBar from '../../components/common/HorizontalProgressBar';
import { DrivingDetailData } from '../../types/driving';

// 메인 테마 색상 정의
const MAIN_COLORS = {
  primary: '#4945FF',
  background: '#F5F5FF',
};

interface DrivingDetailScreenProps {
  data: DrivingDetailData;
  cardBgColors: string[];
  handleClose: () => void;
  handleCardPress: (cardName: string) => void;
}

const DrivingDetailScreen: React.FC<DrivingDetailScreenProps> = ({
  data,
  cardBgColors,
  handleClose,
  handleCardPress,
}) => {
  // 점수를 0~1 범위의 진행률로 변환 (100점 만점 기준)
  const scoreProgress = data.totalScore / 100;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <DetailHeader title="주행 상세" onClose={handleClose} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 날짜 및 시간 정보 */}
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={18} color={MAIN_COLORS.primary} style={styles.icon} />
          <Text style={[styles.dateText, { color: MAIN_COLORS.primary }]}>{data.date}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Icon name="clock" size={18} color="#666" style={styles.icon} />
          <Text style={styles.timeText}>{data.time}</Text>
        </View>

        {/* 종합 점수 섹션 */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreLabel}>
            <Icon
              name="bar-chart-2"
              size={18}
              color="#666"
              style={styles.icon}
            />
            <Text style={styles.scoreLabelText}>종합점수</Text>
          </View>
          <View style={styles.totalScoreContainer}>
            <Text style={[styles.totalScore, { color: MAIN_COLORS.primary }]}>
              {data.totalScore.toFixed(1)} 점
            </Text>
            
            {/* 프로그레스 바 추가 - 숫자 제거하고 그라데이션 적용 */}
            <HorizontalProgressBar 
              progress={scoreProgress}
              width={280}
              height={20}
              color={MAIN_COLORS.primary}
              backgroundColor={`${MAIN_COLORS.primary}15`} // 15% 투명도
              style={styles.progressBar}
              showPercentage={false} // 퍼센트 숫자 제거
              useGradient={true} // 그라데이션 사용
              gradientColors={[
                `${MAIN_COLORS.primary}88`, // 시작색 (진한색)
                `${MAIN_COLORS.primary}AA`, // 중간색
                `${MAIN_COLORS.primary}FF`  // 끝색 (연한색)
              ]}
            />
            
            <View style={styles.scoreGuide}>
              <Text style={styles.scoreGuideText}>
                {scoreProgress < 0.4 ? '개선이 필요합니다' : 
                 scoreProgress < 0.7 ? '양호한 운전입니다' : 
                 '훌륭한 운전입니다'}
              </Text>
            </View>
          </View>
        </View>

        {/* 운전 점수 리포트 섹션 */}
        <Text style={styles.reportTitle}>운전 점수 리포트</Text>
        
        {/* 원형 차트 그리드 */}
        <View style={styles.circleGrid}>
          {data.scores.map((score, idx) => (
            <ScoreCard
              key={idx}
              score={score}
              bgColor={cardBgColors[idx]}
              onPress={() => handleCardPress(score.name)}
            />
          ))}
        </View>

        {/* 피드백 메시지 */}
        <FeedbackMessage 
          message={data.message} 
          screenType="main" // 메인 파란색 사용
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  scoreSection: {
    marginTop: 20,
  },
  scoreLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalScoreContainer: {
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#F1F5FD',
    borderRadius: 15,
    padding: 15,
  },
  totalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    marginTop: 8,
    marginBottom: 4,
  },
  scoreGuide: {
    marginTop: 8,
  },
  scoreGuideText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
  },
  circleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default DrivingDetailScreen;
