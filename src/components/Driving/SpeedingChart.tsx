import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { SAFETY_COLORS } from '../../theme/colors';

interface SpeedingChartProps {
  data: any[];
  title: string;
  speedLimit: number;
  height?: number;
  width?: number;
}

// 차트의 제한속도 라인 위치를 계산하는 함수
const calculateSpeedLimitPosition = (
  speedLimit: number,
  maxValue: number,
  chartHeight: number,
): number => {
  const dataAreaHeight = chartHeight * 0.85; // 데이터 영역 비율 증가
  const topPadding = chartHeight * 0.155;     // 상단 패딩 증가
  const percentage = (maxValue - speedLimit) / maxValue;
  return topPadding + (dataAreaHeight * percentage);
};

const SpeedLimitLabel = ({limit}: {limit: number}) => (
  <Text style={styles.speedLimitText}>제한속도: {limit}km/h</Text>
);

const SpeedingChart: React.FC<SpeedingChartProps> = ({ 
  data, 
  title, 
  speedLimit,
  height = 200,
  width = 300
}) => {
  // 라인 차트 설정
  const lineChartConfig = {
    width: width,
    height: height,
    hideDataPoints: false,
    spacing: data.length > 8 ? 25 : 32,
    color: SAFETY_COLORS.primary,
    thickness: 3,
    startFillColor: 'rgba(104, 211, 146, 0.6)',
    endFillColor: 'rgba(104, 211, 146, 0.1)',
    initialSpacing: 16,
    yAxisColor: SAFETY_COLORS.chart.grid,
    yAxisThickness: 1,
    rulesColor: SAFETY_COLORS.chart.grid,
    yAxisTextStyle: styles.chartAxisText,
    xAxisColor: SAFETY_COLORS.chart.grid,
    xAxisThickness: 1,
    showVerticalLines: true,
    verticalLinesColor: SAFETY_COLORS.chart.lightGrid,
    yAxisLabelTexts: ['0', '25', '50', '75', '100', '125', '150'],
    yAxisLabelWidth: 45,
    xAxisLabelTextStyle: styles.chartAxisText,
    xAxisLabelsHeight: 24,
    xAxisLabelsVerticalShift: 5,
    curved: true,
    isAnimated: true,
    animationDuration: 800,
    noOfSections: 6,
    showYAxisIndices: true,
    yAxisIndicesHeight: 4,
    rulesType: 'solid',
    rulesThickness: 1,
    hideRules: false,
    maxValue: 150,
    hideOrigin: true,
    focusedDataPointRadius: 6,
    showFractionalValues: true,
    scrollToEnd: data.length > 10,
    scrollAnimation: true,
    adjustToWidth: data.length <= 8,
    pointerConfig: {
      pointerStripHeight: 160,
      pointerStripColor: 'rgba(100, 100, 100, 0.2)',
      pointerStripWidth: 3,
      pointerColor: SAFETY_COLORS.chart.green,
      radius: 8,
      pointerLabelWidth: 110,
      pointerLabelHeight: 40,
      pointerVanishDelay: 2000,
      activatePointersOnLongPress: true,
      autoAdjustPointerLabelPosition: true,
      pointerLabelComponent: (items: Array<{value?: number}>) => {
        const item = items[0];
        const isOverLimit = (item?.value || 0) > speedLimit;
        return (
          <View
            style={[
              styles.pointerLabelContainer,
              {borderColor: isOverLimit ? SAFETY_COLORS.chart.red : SAFETY_COLORS.primary},
            ]}>
            <Text
              style={[
                styles.pointerLabelText,
                {color: isOverLimit ? SAFETY_COLORS.chart.red : SAFETY_COLORS.primary},
              ]}>
              {item?.value} km/h
            </Text>
          </View>
        );
      },
    },
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={[styles.chartInnerContainer, {minHeight: height + 40}]}>
        <View style={styles.chartContent}>
          <LineChart data={data} {...lineChartConfig} />

          {/* 제한속도 표시 라인 */}
          <View
            style={{
              position: 'absolute',
              width: '110%',
              left: '-5%',
              borderWidth: 1.5,
              borderColor: SAFETY_COLORS.chart.red,
              borderStyle: 'dashed',
              zIndex: 5,
              shadowColor: SAFETY_COLORS.chart.red,
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 3,
              top: calculateSpeedLimitPosition(speedLimit, 150, height),
            }}>
            <SpeedLimitLabel limit={speedLimit} />
          </View>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, {backgroundColor: SAFETY_COLORS.chart.green}]} />
          <Text style={styles.legendText}>평균 속도</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.limitLine, {backgroundColor: SAFETY_COLORS.chart.red}]} />
          <Text style={styles.legendText}>제한 속도</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendText}>※ 가로축: 시간 구간</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: '#2D3748',
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
  chartContent: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 24,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '600',
  },
  limitLine: {
    width: 12,
    height: 2,
    backgroundColor: '#E53E3E',
    marginRight: 6,
  },
  chartAxisText: {
    color: '#4A5568',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  speedLimitText: {
    position: 'absolute',
    right: 5,
    top: -24,
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53E3E',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  pointerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 50,
    padding: 8,
  },
  pointerLabelText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default SpeedingChart;