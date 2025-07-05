import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { IdlingEvent } from '../../types/report';
import { CARBON_COLORS } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Feather';

interface IdlingBarChartProps {
  events: IdlingEvent[];
  title: string;
  totalIdlingMinutes?: number;
  score: number;
}

const IdlingBarChart: React.FC<IdlingBarChartProps> = ({ 
  events, 
  title,
  totalIdlingMinutes,
  score
}) => {
  // 화면에 한 번에 표시할 최대 이벤트 수
  const MAX_VISIBLE_ITEMS = 5;
  const [showAllEvents, setShowAllEvents] = useState(false);
  
  // 각 이벤트의 지속 시간 계산 (초 단위로 계산)
  const eventsWithDuration = useMemo(() => {
    return events.map(event => {
      const durationSeconds = event.durationSeconds || 0;
      const penaltySeconds = Math.max(0, durationSeconds - 120);
      const penaltyPoints = penaltySeconds > 0 ? Math.ceil(penaltySeconds / 30) * 5 : 0;
      
      return { 
        ...event, 
        durationSeconds,
        penalty: penaltyPoints,
        overThreshold: durationSeconds > 120
      };
    });
  }, [events]);

  // 총 감점 포인트 계산
  const totalPenalty = useMemo(() => {
    return eventsWithDuration.reduce((sum, event) => sum + event.penalty, 0);
  }, [eventsWithDuration]);

  // 표시할 이벤트 필터링
  const visibleEvents = useMemo(() => {
    return showAllEvents ? eventsWithDuration : eventsWithDuration.slice(0, MAX_VISIBLE_ITEMS);
  }, [eventsWithDuration, showAllEvents]);

  // 최대 시간 계산 (초 단위)
  const maxDurationSeconds = Math.max(
    ...eventsWithDuration.map(event => event.durationSeconds || 0),
    120, // 최소 2분(120초) 표시
    10 // 모든 값이 작을 경우 최소값
  );
  
  // 차트 최대값 (올림하여 30초 단위로 깔끔하게)
  const chartMaxSeconds = Math.ceil(maxDurationSeconds / 30) * 30;
  
  // x축 스케일 표시 값들 (초 단위)
  const scaleValues = useMemo(() => {
    // 짧은 시간 범위일 때와 긴 시간 범위일 때 다른 간격 적용
    const step = chartMaxSeconds <= 240 ? 30 : 60;
    const values = [];
    
    for (let i = 0; i <= chartMaxSeconds; i += step) {
      values.push(i);
    }
    
    // 마지막 값이 chartMaxSeconds가 아니면 추가
    if (values[values.length - 1] !== chartMaxSeconds) {
      values.push(chartMaxSeconds);
    }
    
    return values;
  }, [chartMaxSeconds]);
  
  // 실제 총 공회전 시간 계산 (초 -> 분 변환)
  const calculatedTotalMinutes = eventsWithDuration.reduce(
    (sum, event) => sum + (event.durationSeconds || 0), 0
  ) / 60;
  
  // 총 공회전 시간 (props로 받은 값이 있으면 사용, 없으면 계산)
  const finalTotalMinutes = totalIdlingMinutes !== undefined ? 
    totalIdlingMinutes : calculatedTotalMinutes;

  // 차트 컨테이너 높이 계산 (이벤트 당 최소 높이 보장)
  const getChartHeight = () => {
    const baseHeight = 80; // 기본 높이 (X축 레이블, 여백 등)
    const barHeight = 50; // 각 막대 높이 (막대 + 여백)
    return baseHeight + (visibleEvents.length * barHeight);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {/* 공회전 시간대 분석 박스 */}
      <View style={styles.analysisBox}>
        <Text style={styles.infoText}>* 2분 초과 시 30초당 5점 감점</Text>
        {totalPenalty > 0 && (
          <Text style={styles.penaltySummary}>총 감점: -{totalPenalty}점</Text>
        )}
      </View>
      
      <View style={[styles.chartContainer, { height: getChartHeight() }]}>
        {/* Y축 레이블 (구간 번호) */}
        <View style={styles.yAxisLabels}>
          {visibleEvents.map((_, index) => (
            <View key={`label-${index}`} style={styles.yAxisLabelContainer}>
              <Text style={styles.yAxisLabel}>구간 {index + 1}</Text>
            </View>
          ))}
        </View>
        
        {/* 차트 영역 */}
        <View style={styles.barChartArea}>
          {/* X축 눈금 및 그리드라인 */}
          <View style={styles.xAxisGrid}>
            {scaleValues.map((value, index) => (
              <View 
                key={`grid-${index}`} 
                style={[
                  styles.gridLine,
                  { left: `${(value / chartMaxSeconds) * 100}%` }
                ]}
              >
                <Text style={[
                  styles.scaleText,
                  // 마지막 눈금은 오른쪽 정렬, 처음은 왼쪽, 나머지는 중앙
                  index === scaleValues.length - 1 
                    ? { right: 0, transform: [] } 
                    : (index === 0 
                      ? { left: 0, transform: [] } 
                      : { transform: [{ translateX: -10 }] })
                ]}>
                  {value}초
                </Text>
              </View>
            ))}
            
            {/* 2분 기준선 (감점 시작점) */}
            {chartMaxSeconds > 120 && (
              <View 
                style={[
                  styles.thresholdLine, 
                  { left: `${(120 / chartMaxSeconds) * 100}%` }
                ]}
              />
            )}
          </View>
          
          {/* 막대 그래프 */}
          <View style={styles.barsContainer}>
            {visibleEvents.map((event, index) => {
              const durationSeconds = event.durationSeconds || 0;
              const normalWidth = `${Math.min(durationSeconds, 120) / chartMaxSeconds * 100}%`;
              const penaltyWidth = event.overThreshold ? 
                `${Math.max(0, durationSeconds - 120) / chartMaxSeconds * 100}%` : '0%';
              
              return (
                <View key={`bar-${index}`} style={styles.barRow}>
                  {/* 기본 구간 (2분 이하) */}
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: normalWidth,
                        backgroundColor: CARBON_COLORS.chart.blue 
                      }
                    ]}
                  />
                  
                  {/* 감점 구간 (2분 초과) */}
                  {event.overThreshold && (
                    <View 
                      style={[
                        styles.penaltyBar, 
                        { width: penaltyWidth }
                      ]}
                    >
                      {event.penalty > 0 && (
                        <Text style={styles.penaltyText}>
                          -{event.penalty}
                        </Text>
                      )}
                    </View>
                  )}
                  
                  {/* 지속 시간 표시 - 긴 경우 막대 바깥으로 나가지 않게 */}
                  <Text 
                    style={[
                      styles.barValue,
                      { color: durationSeconds > chartMaxSeconds * 0.7 ? '#2D3748' : '#2D3748' }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {durationSeconds.toFixed(1)}초
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      
      {/* 더 보기/접기 버튼 */}
      {eventsWithDuration.length > MAX_VISIBLE_ITEMS && (
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowAllEvents(!showAllEvents)}
        >
          <Text style={styles.toggleButtonText}>
            {showAllEvents 
              ? '접기' 
              : `더 보기 (${eventsWithDuration.length - MAX_VISIBLE_ITEMS}개 더)`}
          </Text>
          <Icon 
            name={showAllEvents ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="#4A5568" 
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
      )}
      
      {/* 시간 정보 영역 */}
      <ScrollView style={styles.timeInfoContainer} nestedScrollEnabled>
        {visibleEvents.map((event, index) => (
          <View key={`time-${index}`} style={styles.timeRow}>
            <Text style={styles.timeLabel}>
              구간 {index + 1}:
            </Text>
            <Text style={styles.timeValue} numberOfLines={1} ellipsizeMode="tail">
              {event.formattedStartTime && event.formattedEndTime ? 
                `${event.formattedStartTime} ~ ${event.formattedEndTime}` : 
                `${formatTime(event.startTime)} ~ ${formatTime(event.endTime)}`}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// 시간 포맷팅 함수 개선
const formatTime = (timeString: string) => {
  try {
    // ISO 8601 형식 문자열에서 직접 시간 추출 (가장 정확한 방법)
    if (typeof timeString === 'string' && timeString.includes('T')) {
      const matches = timeString.match(/T(\d{2}):(\d{2}):(\d{2})/);
      if (matches && matches.length === 4) {
        return `${matches[1]}:${matches[2]}:${matches[3]}`;
      }
    }
    
    // Date 객체로 파싱 시도
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
    
    // 기존 형식 유지
    return timeString || '00:00:00';
  } catch (e) {
    console.error('시간 포맷팅 오류:', e);
    return '00:00:00';
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  analysisBox: {
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  penaltySummary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#718096',
  },
  chartContainer: {
    flexDirection: 'row',
    width: '100%',
    // 높이는 동적으로 계산됨
  },
  yAxisLabels: {
    width: 60,
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  yAxisLabelContainer: {
    height: 40,
    justifyContent: 'center',
  },
  yAxisLabel: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'right',
    paddingRight: 8,
  },
  barChartArea: {
    flex: 1,
    position: 'relative',
    marginRight: 8,
  },
  xAxisGrid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    paddingTop: 5,
  },
  gridLine: {
    position: 'absolute',
    top: -15,
    bottom: 20,
    width: 1,
    backgroundColor: 'rgba(203, 213, 224, 0.5)',
  },
  scaleText: {
    position: 'absolute',
    bottom: 0,
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  thresholdLine: {
    position: 'absolute',
    top: -15,
    bottom: 20,
    width: 2,
    backgroundColor: 'rgba(229, 62, 62, 0.7)',
    zIndex: 5,
  },
  barsContainer: {
    paddingBottom: 25,
    height: '100%',
    justifyContent: 'space-around',
  },
  barRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bar: {
    height: 25,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    minWidth: 5,
  },
  penaltyBar: {
    height: 25,
    backgroundColor: '#E53E3E',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  penaltyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  barValue: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3748',
    maxWidth: 80, // 너무 긴 텍스트 방지
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
    marginVertical: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  timeInfoContainer: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    maxHeight: 150, // 시간 정보 영역 최대 높이 제한
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  timeLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
  },
  timeValue: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
  },
});

export default IdlingBarChart;