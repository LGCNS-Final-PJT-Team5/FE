import {View, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {DrivingRecommendations} from '../../../types/report';
import RecommendationItem from './RecommendationItem';
import React from 'react';

export default function TipBox({
  recommendations,
}: {
  recommendations: DrivingRecommendations;
}) {
  return (
    <View style={styles.tipBox}>
      {/* 제목 */}
      <View style={styles.tipTitleRow}>
        <MaterialCommunityIcons
          name="lightbulb-outline"
          size={24}
          color="#3F5AF0"
        />
        <Text style={styles.tipTitleText}>{recommendations.title}</Text>
      </View>

      {/* 요약 문단 */}
      <Text style={styles.summaryText}>{recommendations.summary}</Text>

      {/* 팁 리스트 */}
      {recommendations.tips.map((tip, index) => (
        <RecommendationItem key={index} index={index} text={tip.text} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tipBox: {
    backgroundColor: '#F1F5FD',
    gap: 12,
    padding: 15,
    borderRadius: 12,
  },
  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
  },
  tipListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  tipCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D3D9F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipCircleText: {
    color: '#3F5AF0',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tipListText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
    flex: 1,
  },
  tipHighlight: {
    color: '#000',
    fontWeight: 'bold',
  },
});
