import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { SAFETY_COLORS } from '../../theme/colors';

interface AccelerationStatistics {
  totalEvents: number;
  highAcceleration: number;
  normalAcceleration: number;
  formula: {
    normal: number;
    high: number;
    calculated: number;
  };
}

interface AccelerationDetailChartProps {
  data: Array<{
    value: number;
    label: string;
    frontColor: string;
    accelerationType: string;
    time: string;
  }>;
  title: string;
  score: number;
  statistics: AccelerationStatistics;
  feedback: string;
}

const AccelerationDetailChart: React.FC<AccelerationDetailChartProps> = ({
  data,
  title,
  score,
  statistics,
  feedback
}) => {
  // 차트 설정
  const barChartConfig = {
    barWidth: 30,
    spacing: 24,
    barBorderRadius: 8,
    yAxisThickness: 0,
    xAxisThickness: 1,
    xAxisColor: SAFETY_COLORS.chart.grid,
    height: 200,
    noOfSections: 3,
    maxValue: 100,
    showLine: false,
    isAnimated: true,
    animationDuration: 800,
    barStyle: {
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.05)',
    }
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      
      {/* 점수 표시 */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>점수</Text>
        <Text style={[
          styles.scoreValue, 
          {color: score >= 80 ? '#38A169' : score >= 50 ? '#DD6B20' : '#E53E3E'}
        ]}>
          {score.toFixed(1)}점
        </Text>
      </View>

      {/* 차트 영역 */}
      <View style={styles.chartInnerContainer}>
        <View style={styles.chartContent}>
          <BarChart 
            data={data.map(item => ({
              ...item,
              topLabelComponent: () => (
                <Text style={{
                  color: item.frontColor,
                  fontSize: 10,
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  {item.accelerationType}
                </Text>
              )
            }))} 
            {...barChartConfig} 
          />
        </View>
      </View>
      
      {/* 통계 요약 */}
      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticsTitle}>이벤트 통계</Text>
        <View style={styles.statisticsRow}>
          <View style={styles.statisticItem}>
            <Text style={styles.statNumber}>{statistics.totalEvents}</Text>
            <Text style={styles.statLabel}>총 발생</Text>
          </View>
          <View style={styles.statisticItem}>
            <Text style={[styles.statNumber, {color: '#E53E3E'}]}>
              {statistics.highAcceleration}
            </Text>
            <Text style={styles.statLabel}>급가속</Text>
          </View>
          <View style={styles.statisticItem}>
            <Text style={[styles.statNumber, {color: '#4CAF50'}]}>
              {statistics.normalAcceleration}
            </Text>
            <Text style={styles.statLabel}>정상가속</Text>
          </View>
        </View>
      </View>
      
      {/* 점수 계산 공식 */}
      <View style={styles.formulaContainer}>
        <Text style={styles.formulaTitle}>점수 계산 방식</Text>
        <View style={styles.formula}>
          <Text style={styles.formulaText}>
            100 × {statistics.formula.normal} ÷ ({statistics.formula.high} + {statistics.formula.normal}) = {statistics.formula.calculated}점
          </Text>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#E53E3E' }]} />
              <Text style={styles.legendText}>급가속: {statistics.highAcceleration}회</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>정상가속: {statistics.normalAcceleration}회</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* 피드백 */}
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>운전 피드백</Text>
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
    padding: 16,
    backgroundColor: '#F9FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  chartTitle: {
    fontSize: 18,
    color: '#2D3748',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(226, 232, 240, 0.5)',
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartInnerContainer: {
    padding: 8,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartContent: {
    paddingVertical: 8,
    alignItems: 'center',
    width: '100%',
  },
  statisticsContainer: {
    backgroundColor: '#EDF2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statisticsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statisticItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  formulaContainer: {
    backgroundColor: '#EBF8FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C5282',
    marginBottom: 8,
  },
  formula: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A365D',
    textAlign: 'center',
    marginBottom: 8,
  },
  legendContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#4A5568',
  },
  feedbackContainer: {
    backgroundColor: '#F0FFF4',
    padding: 12,
    borderRadius: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#276749',
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 13,
    color: '#2D3748',
    lineHeight: 20,
  },
});

export default AccelerationDetailChart;