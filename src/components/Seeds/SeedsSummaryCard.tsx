import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type SeedsSummaryCardProps = {
  balance: number;
  total: number;
};

const SeedsSummaryCard = ({balance, total}: SeedsSummaryCardProps) => {
  return (
    <View style={styles.seedSummaryCard}>
      <View style={styles.seedSummaryLabelContainer}>
        <Text style={styles.seedAvailableLabel}>사용 가능 씨앗</Text>
        <Text style={styles.seedAvailableCount}>{balance}</Text>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.seedSummaryLabelContainer}>
        <Text style={styles.seedTotalLabel}>총 사용 씨앗</Text>
        <Text style={styles.seedTotalCount}>{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seedSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 20,
  },
  seedSummaryLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seedAvailableLabel: {
    fontSize: 16,
    color: 'white',
  },
  seedAvailableCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 12,
  },
  seedTotalLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  seedTotalCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
  },
});

export default SeedsSummaryCard;
