import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { ACCIDENT_COLORS } from '../../theme/colors';
import { ReactionTimelineEvent } from '../../types/report';

interface ReactionSpeedChartProps {
  events: ReactionTimelineEvent[];
  height?: number;
  score?: number;
  driveStartTime?: string; // 주행 시작 시간 (선택 사항)
  driveEndTime?: string;   // 주행 종료 시간 (선택 사항)
}

const screenWidth = Dimensions.get('window').width;

const ReactionSpeedChart: React.FC<ReactionSpeedChartProps> = ({ 
  events, 
  height = 200, 
  score = 100,
  driveStartTime, // 주행 시작 시간
  driveEndTime    // 주행 종료 시간
}) => {
  const width = screenWidth - 80;
  const chartHeight = height - 40;
  
  // 시간 변환 함수 개선 - 시/분/초 모두 고려
  const timeToMinutes = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes() + (date.getSeconds() / 60);
  };
  
  // 시간 범위 계산 개선
  const calculateTimeRange = () => {
    // 이벤트가 없거나 1개뿐인 경우 처리
    if (!events || events.length === 0) {
      return { startTime: 0, endTime: 60, timeRange: 60 };
    }
    
    // 주행 시간이 제공된 경우 사용
    let start = driveStartTime ? timeToMinutes(driveStartTime) : 
                timeToMinutes(events[0]?.time);
                
    let end = driveEndTime ? timeToMinutes(driveEndTime) : 
              timeToMinutes(events[events.length - 1]?.time);
    
    // 모든 이벤트가 같은 시간에 있을 경우 기본 범위 설정
    if (end - start < 5) {
      start -= 5;
      end += 5;
    }
    
    const range = end - start;
    return { startTime: start, endTime: end, timeRange: range };
  };
  
  const { startTime, endTime, timeRange } = calculateTimeRange();
  
  // 총 감점 수 계산 (100점 - 현재 점수) / 10
  const penaltyCount = Math.round((100 - score) / 10);
  
  // 이벤트 데이터를 시간 순으로 정렬
  const sortedEvents = events && events.length > 0 ? 
    [...events].sort((a, b) => {
      const timeA = timeToMinutes(a.time);
      const timeB = timeToMinutes(b.time);
      return timeA - timeB;
    }) : [];
    
  // 반응 시간 데이터 포인트 생성
  const generateDataPoints = () => {
    const points = [];
    const numPoints = 100; // 데이터 포인트 수
    
    // 시간 범위를 균등하게 나누어 데이터 포인트 생성
    for (let i = 0; i < numPoints; i++) {
      const minute = startTime + (timeRange * i / (numPoints - 1));
      
      // 이벤트 발생 근처에서는 반응 시간 높게 설정
      let nearestEventDistance = Infinity;
      let isNearEvent = false;
      
      // null 체크 추가
      if (sortedEvents && sortedEvents.length > 0) {
        sortedEvents.forEach((event, idx) => {
          const eventMinute = timeToMinutes(event.time);
          const distance = Math.abs(eventMinute - minute);
          
          // 이벤트와의 거리가 가까우면 반응 시간 높게 설정
          if (distance < nearestEventDistance) {
            nearestEventDistance = distance;
          }
          
          if (distance < 2) {
            isNearEvent = true;
          }
        });
      }
      
      // 반응 시간 값 계산 (0-1 사이)
      let value;
      
      if (isNearEvent) {
        // 이벤트 근처: 점수에 따라 반응 시간 조절
        const isPenaltyEvent = penaltyCount > 0;
        
        if (isPenaltyEvent) {
          // 감점이 있으면 높은 값 = 나쁜 반응
          const proximity = Math.max(0, 1 - nearestEventDistance * 0.5);
          value = 0.7 + proximity * 0.3; // 0.7-1.0 사이 (나쁜 반응)
        } else {
          // 감점이 없으면 낮은 값 = 좋은 반응
          const proximity = Math.max(0, 1 - nearestEventDistance * 0.5);
          value = 0.2 + proximity * 0.3; // 0.2-0.5 사이 (좋은 반응)
        }
      } else {
        // 일반 상황: 정상 반응 (낮은 값 = 좋음)
        // 이벤트와의 거리에 반비례
        value = Math.max(0.2, Math.min(0.5, 0.5 - (nearestEventDistance * 0.01)));
      }
      
      const x = ((minute - startTime) / timeRange) * width;
      const y = chartHeight - (value * (chartHeight - 30)) - 10; // 위쪽이 좋은 값
      
      points.push({ x, y, minute, value });
    }
    return points;
  };
  
  const dataPoints = generateDataPoints();
  
  // SVG 경로 생성
  const createLinePath = () => {
    return dataPoints.map((point, index) => 
      (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
    ).join(' ');
  };
  
  return (
    <View style={[styles.chartSpecialContainer, { height }]}>
      <Text style={styles.chartTitle}>반응 속도 변화 추이</Text>
      
      {/* 점수 및 감점 정보 표시 */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          반응 점수: <Text style={[styles.scoreValue, 
            {color: score === 100 ? ACCIDENT_COLORS.chart.green : ACCIDENT_COLORS.chart.purple}]}>
            {score.toFixed(1)}점
          </Text>
        </Text>
        <Text style={styles.penaltyText}>
          느린 반응 감지: <Text style={styles.penaltyValue}>{penaltyCount}회</Text> 
          {penaltyCount > 0 ? '(각 -10점)' : ''}
        </Text>
      </View>
      
      <Svg width={width} height={chartHeight}>
        {/* 배경 격자 */}
        <Line 
          x1={0} y1={chartHeight - 10}
          x2={width} y2={chartHeight - 10}
          stroke={ACCIDENT_COLORS.chart.grid} strokeWidth={1}
        />
        <Line 
          x1={0} y1={(chartHeight - 10) * 0.5}
          x2={width} y2={(chartHeight - 10) * 0.5}
          stroke={ACCIDENT_COLORS.chart.lightGrid} strokeWidth={1}
          strokeDasharray="5,5"
        />
        
        {/* 위험 구간 표시 - 감점이 있을 경우에만 */}
        {penaltyCount > 0 && (
          <Rect 
            x={0} y={0} 
            width={width} 
            height={(chartHeight - 10) * 0.3}
            fill="rgba(229, 62, 62, 0.1)" 
          />
        )}
        
        {/* 위험 구간 텍스트 위치 조정 */}
        {penaltyCount > 0 && (
          <SvgText 
            x={width / 2} 
            y={15} 
            fill={ACCIDENT_COLORS.chart.red} 
            fontSize={11}
            fontWeight="bold"
            textAnchor="middle"
          >
            위험(구간초과반응)
          </SvgText>
        )}
        
        {/* 반응 시간 선 그래프 */}
        <Path 
          d={createLinePath()} 
          stroke={score === 100 ? ACCIDENT_COLORS.chart.green : ACCIDENT_COLORS.chart.purple}
          strokeWidth={3}
          fill="none"
        />
        
        {/* 이벤트 발생 지점 표시 - 간격 벌리기 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          
          // 이벤트 유형에 따른 색상 결정 (감점 여부)
          const isPenalty = index < penaltyCount;
          const eventColor = isPenalty ? ACCIDENT_COLORS.chart.red : ACCIDENT_COLORS.chart.green;
          
          return (
            <G key={`event-${index}`}>
              <Line 
                x1={x} y1={0} 
                x2={x} y2={chartHeight - 10} 
                stroke={eventColor}
                strokeWidth={2}
                strokeDasharray="3,3"
              />
              <Circle 
                cx={x} cy={10} 
                r={6} 
                fill={eventColor}
              />
              
              {/* 시간 텍스트 조정 - 더 아래로 */}
              <SvgText 
                x={x} 
                y={chartHeight + 10} // 위치 조정
                fontSize={10}
                fill={ACCIDENT_COLORS.text.secondary}
                textAnchor="middle"
              >
                {event.formattedTime}
              </SvgText>
              
              {/* 감점 표시 위치 개선 */}
              {isPenalty && (
                <SvgText 
                  x={x} 
                  y={40} // 위치 조정
                  fontSize={10}
                  fill={eventColor}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  -10
                </SvgText>
              )}
            </G>
          );
        })}
        
        {/* 라벨 위치 조정 */}
        <SvgText x={8} y={chartHeight - 25} fontSize={10} fill={ACCIDENT_COLORS.text.light}>
          좋음 (1초 내 반응)
        </SvgText>
        
        {/* 나쁨 라벨 이동 */}
        {penaltyCount > 0 && (
          <SvgText x={width - 110} y={15} fontSize={10} fill={ACCIDENT_COLORS.chart.red}>
            나쁨 (1초 초과 반응)
          </SvgText>
        )}
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { 
            backgroundColor: score === 100 ? ACCIDENT_COLORS.chart.green : ACCIDENT_COLORS.chart.purple 
          }]} />
          <Text style={styles.legendText}>반응 시간 추이</Text>
        </View>
        
        {penaltyCount > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.red }]} />
            <Text style={styles.legendText}>느린 반응 (-10점)</Text>
          </View>
        )}
        
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.green }]} />
          <Text style={styles.legendText}>정상 반응</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartSpecialContainer: {
    width: '100%',
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 224, 0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    color: ACCIDENT_COLORS.text.primary,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  scoreContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 224, 0.4)',
  },
  scoreText: {
    fontSize: 15,
    color: ACCIDENT_COLORS.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: ACCIDENT_COLORS.chart.purple,
  },
  penaltyText: {
    fontSize: 13,
    color: ACCIDENT_COLORS.text.secondary,
    marginTop: 2,
  },
  penaltyValue: {
    fontWeight: '700',
    color: ACCIDENT_COLORS.chart.red,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: ACCIDENT_COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
  },
  legendText: {
    fontSize: 13,
    color: ACCIDENT_COLORS.text.primary,
    fontWeight: '600',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  noDataText: {
    fontSize: 15,
    color: ACCIDENT_COLORS.text.secondary,
  },
});

export default ReactionSpeedChart;