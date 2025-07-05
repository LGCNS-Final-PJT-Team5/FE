import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import CircleChart from './CircleChart';
import { DrivingScoreItem } from '../../types/driving';

interface ScoreCardProps {
  score: DrivingScoreItem;
  bgColor: string;
  onPress: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  score, 
  bgColor, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={[styles.circleCard, { backgroundColor: bgColor }]}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityLabel={`${score.name}: ${Math.round(score.value)}%`}
    >
      <CircleChart
        percentage={score.value}
        radius={36}
        color={score.color}
      />
      <Text style={styles.circleLabel} numberOfLines={2}>
        {score.name}
      </Text>
      <View style={styles.arrowContainer}>
        <Icon name="chevron-right" size={16} color="#888" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
    marginBottom: 16,
    position: 'relative',
  },
  circleLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 12,
    padding: 2,
  },
});

export default ScoreCard;