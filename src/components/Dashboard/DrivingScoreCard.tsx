import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PieChart from 'react-native-pie-chart';

export type DrivingScoreCardProps = {
  title: string;
  color: string;
  backgroundColor: string;
  textColor: string;
  score: number;
  data: {value: number; color: string; label: {text: string}}[];
};

export default function DrivingScoreCard({
  title,
  color,
  backgroundColor,
  textColor,
  score,
  data,
}: DrivingScoreCardProps) {
  const isEmpty = score === 0;

  return (
    <View style={[styles.gridItem, {backgroundColor}]}>
      <Text style={[styles.cardTitle, {color}]}>{title}</Text>

      <View style={styles.cardContent}>
        <View style={styles.scoreCard}>
          {!isEmpty ? (
            <>
              <PieChart
                widthAndHeight={100}
                series={data.map(d => ({value: d.value, color: d.color}))}
                cover={0.7}
              />
              <View style={styles.chartCenterText}>
                <Text style={[styles.centerScoreText, {color: textColor}]}>
                  {score.toFixed(2)}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.emptyScore}>
              <Text style={styles.emptyScoreText}>-</Text>
            </View>
          )}
        </View>

        <View style={styles.legendBox}>
          {data.map((d, idx) => (
            <View key={idx} style={styles.legendRow}>
              <View style={[styles.legendDot, {backgroundColor: d.color}]} />
              <Text style={styles.legendLabel}>
                {d.label.text}: {isEmpty ? '0' : d.value}
                {isEmpty ? '회' : '점'}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scoreCard: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyScore: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#E5E7EB',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  chartCenterText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  legendBox: {
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
