import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { CARBON_COLORS } from '../../theme/colors';
import { SpeedMaintainItem } from '../../types/report';

interface SpeedDistributionPieChartProps {
  data: SpeedMaintainItem[];
  title: string;
  pieRadius?: number;
  pieInnerRadius?: number;
}

const SpeedDistributionPieChart: React.FC<SpeedDistributionPieChartProps> = ({ 
  data, 
  title,
  pieRadius = 120,
  pieInnerRadius = 60
}) => {
  // 파이 차트 설정
  const pieChartConfig = {
    donut: true,
    showText: true,
    textSize: 14,
    textColor: 'white',
    radius: pieRadius,
    innerRadius: pieInnerRadius,
    centerLabelComponent: () => (
      <View style={styles.chartCenterLabelContainer}>
        <Text style={styles.chartCenterLabel}>주행 비율</Text>
      </View>
    ),
    focusOnPress: false,
    isAnimated: true,
    animationDuration: 800,
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartInnerContainer}>
        <PieChart data={data} {...pieChartConfig} />

        <View style={styles.speedInfoContainer}>
          <Text style={styles.speedInfoTitle}>주행 속도 분포</Text>
          {data.map((item, index) => (
            <View key={index} style={styles.speedInfoItem}>
              <View style={[styles.speedInfoColor, {backgroundColor: item.color}]} />
              <Text style={styles.speedInfoLabel}>{item.label}</Text>
              <Text style={styles.speedInfoValue}>{item.value}%</Text>
            </View>
          ))}
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
  chartCenterLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    padding: 8,
  },
  chartCenterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  speedInfoContainer: {
    marginTop: 24,
    width: '80%',
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  speedInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 12,
  },
  speedInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  speedInfoColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  speedInfoLabel: {
    fontSize: 14,
    color: '#4A5568',
    flex: 1,
    marginLeft: 8,
  },
  speedInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  }
});

export default SpeedDistributionPieChart;