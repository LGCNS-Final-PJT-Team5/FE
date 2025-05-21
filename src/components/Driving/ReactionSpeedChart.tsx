import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { ACCIDENT_COLORS } from '../../theme/colors';
import { ReactionTimelineEvent } from '../../types/report';

interface ReactionSpeedChartProps {
  events: ReactionTimelineEvent[];
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

const ReactionSpeedChart: React.FC<ReactionSpeedChartProps> = ({ events, height = 200 }) => {
  const width = screenWidth - 80;
  const chartHeight = height - 40;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes();
  };
  
  // 정렬된 이벤트
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 시작/종료 시간
  const startTime = timeToMinutes(sortedEvents[0]?.time) || 0;
  const endTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) || startTime + 60;
  const timeRange = Math.max(endTime - startTime, 60);
  
  // 반응 시간 데이터 포인트 생성 (시뮬레이션)
  const generateDataPoints = () => {
    const points = [];
    const numPoints = 50; // 데이터 포인트 수
    
    for (let i = 0; i < numPoints; i++) {
      const minute = startTime + (timeRange * i / (numPoints - 1));
      
      // 이벤트 발생 근처에서는 반응 시간 높게 설정
      const isNearEvent = sortedEvents.some(event => {
        const eventMinute = timeToMinutes(event.time);
        return Math.abs(eventMinute - minute) < 2;
      });
      
      // 반응 시간 값 (낮을수록 좋음, 높을수록 나쁨) - 시뮬레이션
      // 0-1 사이 값으로 정규화 (0이 가장 좋음, 1이 가장 나쁨)
      const value = isNearEvent ? 
        0.8 + Math.random() * 0.2 : // 이벤트 근처: 높은 반응 시간 (나쁨)
        0.2 + Math.random() * 0.4;  // 일반 상황: 낮은-중간 반응 시간
        
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
        
        {/* 위험 구간 표시 */}
        <Rect 
          x={0} y={0} 
          width={width} 
          height={(chartHeight - 10) * 0.3}
          fill="rgba(229, 62, 62, 0.1)" 
        />
        <SvgText 
          x={8} y={20} 
          fill={ACCIDENT_COLORS.chart.red} 
          fontSize={11}
        >
          위험 구간
        </SvgText>
        
        {/* 반응 시간 선 그래프 */}
        <Path 
          d={createLinePath()} 
          stroke={ACCIDENT_COLORS.chart.purple}
          strokeWidth={3}
          fill="none"
        />
        
        {/* 이벤트 발생 지점 표시 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          
          return (
            <G key={`event-${index}`}>
              <Line 
                x1={x} y1={0} 
                x2={x} y2={chartHeight - 10} 
                stroke={ACCIDENT_COLORS.chart.red}
                strokeWidth={2}
                strokeDasharray="3,3"
              />
              <Circle 
                cx={x} cy={10} 
                r={6} 
                fill={ACCIDENT_COLORS.chart.red} 
              />
              <SvgText 
                x={x} y={chartHeight}
                fontSize={10}
                fill={ACCIDENT_COLORS.text.secondary}
                textAnchor="middle"
              >
                {event.formattedTime}
              </SvgText>
            </G>
          );
        })}
        
        {/* 라벨 */}
        <SvgText x={8} y={chartHeight - 15} fontSize={10} fill={ACCIDENT_COLORS.text.light}>
          좋음
        </SvgText>
        <SvgText x={8} y={20} fontSize={10} fill={ACCIDENT_COLORS.chart.red}>
          나쁨
        </SvgText>
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.purple }]} />
          <Text style={styles.legendText}>반응 시간 추이</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.red }]} />
          <Text style={styles.legendText}>위험 이벤트</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartSpecialContainer: {
    width: '100%',
    marginVertical: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(203, 213, 224, 0.5)',
    overflow: 'hidden',
  },
  chartTitle: {
    fontSize: 18,
    color: ACCIDENT_COLORS.text.primary,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.3,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 14,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 15,
    color: ACCIDENT_COLORS.text.primary,
    fontWeight: '600',
  },
});

export default ReactionSpeedChart;