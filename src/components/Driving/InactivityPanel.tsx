import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TimelineChart from './TimelineChart';
import { InactivityEvent } from '../../types/report';

interface InactivityPanelProps {
  events: InactivityEvent[];
  score: number;
  colors: any;
}

const InactivityPanel: React.FC<InactivityPanelProps> = ({ 
  events, 
  score,
  colors 
}) => {
  const inactivityCount = events.length;
  
  // 점수에 따른 색상
  const scoreColor = score < 50 ? colors.chart.red : colors.chart.yellow;

  return (
    <View style={styles.contentBlock}>
      <Text style={[styles.contentScore, {color: scoreColor}]}>
        {score.toFixed(1)} 점
      </Text>
      <Text style={[styles.contentDesc, {color: colors.text.secondary}]}>
        감지된 차량 미조작: {inactivityCount}회
      </Text>

      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, {color: colors.text.primary}]}>차량 미조작 감지 시점</Text>
        <View style={styles.chartInnerContainer}>
          <TimelineChart
            events={events}
            title="미조작 발생 시간"
            height={200}
          />
          
          <View style={[styles.inactivityListContainer, {backgroundColor: 'rgba(255, 217, 39, 0.1)'}]}>
            <Text style={[styles.inactivityListTitle, {color: colors.text.primary}]}>미조작 감지 시간</Text>
            <View style={styles.inactivityList}>
              {events.map((event, index) => (
                <View key={index} style={styles.inactivityItem}>
                  <Text style={[styles.inactivityIndex, {color: colors.text.primary}]}>#{index + 1}</Text>
                  <Text style={[styles.inactivityTime, {color: colors.text.primary}]}>{event.formattedTime}</Text>
                  <Icon name="alert-triangle" size={16} color={colors.chart.red} />
                </View>
              ))}
            </View>
          </View>
          
          <View style={[styles.inactivityInfoBox, {backgroundColor: 'rgba(255, 217, 39, 0.1)'}]}>
            <Icon name="info" size={20} color={colors.primary} />
            <Text style={[styles.inactivityInfoText, {color: colors.text.secondary}]}>
              차량 미조작은 핸들을 잡지 않거나 운전에 주의를 기울이지 않는 상태를 감지한 것입니다.
              주행 중에는 항상 핸들을 잡고 전방 주시를 유지하세요.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  contentScore: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: 16,
    textShadowColor: 'rgba(0,0,0,0.08)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  contentDesc: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
    paddingHorizontal: 16,
  },
  chartContainer: {
    marginTop: 24,
    marginBottom: 8,
    width: '100%',
    padding: 24,
    backgroundColor: '#F9FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  chartInnerContainer: {
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    minHeight: 250,
    overflow: 'visible',
  },
  inactivityListContainer: {
    width: '90%',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  inactivityListTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  inactivityList: {
    width: '100%',
  },
  inactivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.3)',
  },
  inactivityIndex: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  inactivityTime: {
    flex: 1,
    fontSize: 14,
  },
  inactivityInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '90%',
  },
  inactivityInfoText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default InactivityPanel;