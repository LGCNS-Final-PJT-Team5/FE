import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SeedsHistoryItem from './SeedsHistoryItem';
import {formatDate} from '../../utils/date';
import {SeedHistoryRawItem} from '../../types/seeds';

type SeedsHistoryListProps = {
  seedsHistory: SeedHistoryRawItem[];
};

const SeedsHistoryList = ({seedsHistory}: SeedsHistoryListProps) => {
  let lastDate: string | null = null;

  return (
    <>
      {seedsHistory.map((item, index) => {
        const displayDate = formatDate(item.createdAt);
        const showDate = displayDate !== lastDate;
        lastDate = displayDate;

        return (
          <View key={index} style={{width: '100%'}}>
            {showDate && <Text style={styles.dateHeader}>{displayDate}</Text>}
            <SeedsHistoryItem item={item} />
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 8,
  },
});

export default SeedsHistoryList;
