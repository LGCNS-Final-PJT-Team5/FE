import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HorizontalProgressBar from '../common/HorizontalProgressBar';
import { DrivingSession } from '../../types/report';

interface DrivingTimePanelProps {
  session: DrivingSession;
  score: number;
  colors: any;
}

const DrivingTimePanel: React.FC<DrivingTimePanelProps> = ({ 
  session, 
  score,
  colors
}) => {
  const totalDrivingHours = session?.durationHours || 0;
  const sessionStartTime = session?.formattedStartTime || "";
  const sessionEndTime = session?.formattedEndTime || "";
  
  // 점수에 따른 색상
  const scoreColor = score < 50 ? colors.chart.red : colors.chart.yellow;
  
  return (
    <View style={styles.contentBlock}>
      <Text style={[styles.contentScore, {color: scoreColor}]}>
        {score.toFixed(1)} 점
      </Text>
      <Text style={styles.contentDesc}>
        총 운전 시간: {totalDrivingHours.toFixed(1)}시간
      </Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>운전 시간 분석</Text>
        <View style={styles.chartInnerContainer}>
          <View style={[styles.drivingTimeInfo, {backgroundColor: 'rgba(255, 217, 39, 0.1)'}]}>
            <View style={styles.drivingTimeRow}>
              <Icon name="clock" size={20} color={colors.chart.yellow} />
              <Text style={styles.drivingTimeText}>
                {sessionStartTime} ~ {sessionEndTime}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>
              2시간 권장 운전 시간 대비 ({totalDrivingHours.toFixed(1)}/2시간)
            </Text>
            <HorizontalProgressBar
              progress={session?.progress || 0}
              width={300}
              height={30}
              color={
                totalDrivingHours > 4 ? colors.chart.red : colors.chart.yellow
              }
              backgroundColor="rgba(255, 217, 39, 0.2)"
              useGradient={true}
              gradientColors={[
                `${colors.chart.yellow}FF`,
                `${colors.chart.yellow}AA`,
                `${colors.chart.yellow}88`
              ]}
              style={{marginVertical: 16}}
            />
            
            <View style={styles.progressInfoContainer}>
              <View style={styles.progressInfo}>
                <Icon name="info" size={16} color={colors.chart.blue} />
                <Text style={[styles.progressInfoText, {color: colors.text.secondary}]}>
                  한 번에 2시간 이상 운전 시 휴식이 필요합니다.
                </Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.safetyGuideContainer, {borderLeftColor: colors.chart.green}]}>
            <Text style={[styles.safetyGuideTitle, {color: colors.text.primary}]}>안전 운전 시간 가이드</Text>
            <View style={styles.safetyGuideItem}>
              <Icon name="check-circle" size={16} color={colors.chart.green} />
              <Text style={[styles.safetyGuideText, {color: colors.text.secondary}]}>
                2시간 연속 운전 후에는 최소 10~15분 휴식
              </Text>
            </View>
            <View style={styles.safetyGuideItem}>
              <Icon name="check-circle" size={16} color={colors.chart.green} />
              <Text style={[styles.safetyGuideText, {color: colors.text.secondary}]}>
                4시간 이상 운전 시 30분 이상 충분한 휴식
              </Text>
            </View>
            <View style={styles.safetyGuideItem}>
              <Icon name="check-circle" size={16} color={colors.chart.green} />
              <Text style={[styles.safetyGuideText, {color: colors.text.secondary}]}>
                야간 운전은 더 많은 휴식이 필요합니다.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
  },
  chartContainer: {
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
    padding: 24,
    backgroundColor: '#F9FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  chartInnerContainer: {
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    minHeight: 250,
    overflow: 'visible',
  },
  drivingTimeInfo: {
    width: '90%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  drivingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  drivingTimeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressInfoContainer: {
    width: '100%',
    marginTop: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  progressInfoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  safetyGuideContainer: {
    width: '108%',
    padding: 16,
    backgroundColor: 'rgba(104, 211, 146, 0.1)',
    borderRadius: 12,
    marginTop: 20,
    borderLeftWidth: 4,
  },
  safetyGuideTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  safetyGuideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  safetyGuideText: {
    marginLeft: 10,
    fontSize: 14,
  },
});

export default DrivingTimePanel;