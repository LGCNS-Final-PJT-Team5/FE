import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SAFETY_COLORS } from '../../theme/colors';

interface TurningChartProps {
  data: any[];
  title: string;
  pieRadius?: number;
  pieInnerRadius?: number;
}

// Pie Chart center label component
const PieCenterLabel = () => (
  <View style={styles.pieCenterLabelContainer}>
    <Text style={styles.pieCenterLabel}>회전 비율</Text>
  </View>
);

const TurningChart: React.FC<TurningChartProps> = ({ 
  data, 
  title, 
  pieRadius = 120, 
  pieInnerRadius = 60 
}) => {
  // 파이차트 설정 객체
  const pieChartConfig = {
    donut: true,
    showText: true,
    textSize: 14,
    textColor: 'white',
    textBackgroundColor: 'transparent',
    showTextBackground: false,
    radius: pieRadius,
    innerRadius: pieInnerRadius,
    centerLabelComponent: () => <PieCenterLabel />,
    focusOnPress: true,
    toggleFocusOnPress: true,
    isAnimated: true,
    animationDuration: 800,
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartInnerContainer}>
        <PieChart 
          data={data} 
          {...pieChartConfig} 
          showGradient={false}
          gradientCenterColor={'transparent'}
        />

        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, {backgroundColor: item.color}]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
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
  pieCenterLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pieCenterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
});

export default TurningChart;