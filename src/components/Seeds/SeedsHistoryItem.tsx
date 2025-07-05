import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SeedHistoryRawItem} from '../../types/seeds';

const formatTime = (isoDate: string) => {
  const date = new Date(isoDate);
  
  date.setHours(date.getHours() + 9);

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
};

const SeedsHistoryItem = ({item}: {item: SeedHistoryRawItem}) => {
  return (
    <View style={styles.cardItem}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{item.description}</Text>
        <Text style={styles.cardSub}>{formatTime(item.createdAt)}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={item.type === 'EARNED' ? styles.plus : styles.minus}>
          {item.type === 'EARNED' ? '+' : '-'}
          {item.amount}
        </Text>
        <Text style={styles.cardSub}>{item.balanceSnapshot}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    borderRadius: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  plus: {
    fontSize: 19,
    color: '#4C6EF5',
    fontWeight: 'bold',
  },
  minus: {
    fontSize: 19,
    color: '#888',
    fontWeight: 'bold',
  },
});

export default SeedsHistoryItem;
