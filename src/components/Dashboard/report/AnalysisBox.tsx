import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrivingAnalysis} from '../../../types/report';
import React from 'react';

export default function AnalysisBox({analysis}: {analysis: DrivingAnalysis}) {
  const chartColors = [
    '#3F5AF0',
    '#81C784',
    '#64B5F6',
    '#FFB74D',
    '#BA68C8',
    '#4DB6AC',
  ];

  return (
    <View style={styles.analysisBox}>
      <Text style={styles.analysisTitleText}>
        <MaterialCommunityIcons
          name="google-analytics"
          size={24}
          color="#3F5AF0"
        />
        {'  '}
        {analysis.title}
      </Text>

      <Text style={styles.summaryText}>{analysis.summary}</Text>

      <View style={styles.chartContainer}>
        <View style={styles.scoresContainer}>
          {analysis.data.map((item, index) => {
            const color = chartColors[index % chartColors.length];
            return (
              <View 
                key={index} 
                style={styles.scoreItem} // borderLeftColor 제거
              >
                <View style={styles.scoreHeader}>
                  <Text style={styles.scoreLabel}>{item.label}</Text>
                  <Text style={[styles.scoreValue, { color: color }]}>
                    {item.value}점
                  </Text>
                </View>
                <View style={styles.scoreBarContainer}>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreProgress, 
                        {
                          width: `${item.value}%`,
                          backgroundColor: color
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  analysisBox: {
    backgroundColor: '#F1F5FD',
    gap: 12,
    padding: 15,
    borderRadius: 12,
  },
  analysisTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  scoresContainer: {
    gap: 12,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  scoreItem: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreBarContainer: {
    width: '100%',
  },
  scoreBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E8E8E8',
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
});