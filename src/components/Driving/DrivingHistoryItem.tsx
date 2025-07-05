import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { DriveHistoryItem } from '../../types/driving';
import { formatDate, formatTime } from '../../utils/date';
import { colors } from '../../theme/colors';

interface DrivingHistoryItemProps {
  item: DriveHistoryItem;
  onPress: (driveId: string) => void;
}

const DrivingHistoryItem = ({ item, onPress }: DrivingHistoryItemProps) => {
  return (
    <View style={styles.historyItemWrapper}>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineDot} />
      </View>
      
      <Pressable
        style={styles.historyItem}
        onPress={() => onPress(item.driveId)}
        android_ripple={{ color: colors.primary + '20' }}
        accessibilityRole="button"
        accessibilityLabel={`주행 ${formatDate(item.date)} 상세 보기`}
      >
        <View style={styles.leftContent}>
          <Text style={styles.dateText}>
            {formatDate(item.date)}
          </Text>
          <Text style={styles.timeText}>
            {formatTime(item.startTime, item.endTime)}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.summaryScore.toFixed(2)}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 30,
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background,
    zIndex: 2,
  },
  historyItem: {
    flex: 1,
    backgroundColor: colors.neutralLight,
    borderRadius: 40,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
  },
  leftContent: {
    flex: 1,
  },
  dateText: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    color: colors.neutralDark,
    lineHeight: 22,
    marginBottom: 6,
  },
  timeText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    color: colors.neutralDark,
  },
  scoreContainer: {
    justifyContent: 'center',
    paddingLeft: 12,
  },
  scoreText: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default DrivingHistoryItem;