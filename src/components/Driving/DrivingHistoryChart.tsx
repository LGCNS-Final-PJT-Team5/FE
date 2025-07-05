import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Polyline } from 'react-native-svg';

const DrivingHistoryChart = () => {
  return (
    <View style={styles.chartContainer}>
      <Svg width="100%" height={100}>
        <Defs>
          <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4945FF" />
            <Stop offset="100%" stopColor="#6C63FF" />
          </LinearGradient>
        </Defs>
        <Polyline
          points="15,80 80,40 160,60 240,10"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 30,
    marginBottom: 40,
  }
});

export default DrivingHistoryChart;