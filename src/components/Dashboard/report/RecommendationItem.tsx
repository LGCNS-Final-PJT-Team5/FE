import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type RecommendationItemProps = {
  index: number;
  text: string;
};

export default function RecommendationItem({
  index,
  text,
}: RecommendationItemProps) {
  return (
    <View style={styles.tipListItem}>
      <View style={styles.tipCircle}>
        <Text style={styles.tipCircleText}>{index + 1}</Text>
      </View>
      <Text style={styles.tipListText}>
        {/* 강조 처리 */}
        {text.split('**').map((textPart, idx) =>
          idx % 2 === 1 ? (
            <Text key={idx} style={styles.tipHighlight}>
              {textPart}
            </Text>
          ) : (
            <Text key={idx}>{textPart}</Text>
          ),
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
