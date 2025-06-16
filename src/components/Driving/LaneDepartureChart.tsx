import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { ACCIDENT_COLORS } from '../../theme/colors';
import { LaneDepartureEvent } from '../../types/report';

interface LaneDepartureChartProps {
  events: LaneDepartureEvent[];
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

const LaneDepartureChart: React.FC<LaneDepartureChartProps> = ({ events, height = 200 }) => {
  const width = screenWidth - 80;
  const chartHeight = height - 40;
  const laneHeight = 40;
  const roadHeight = laneHeight * 3; // 3개 차선
  const roadY = (chartHeight - roadHeight) / 2;
  
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
  const timeRange = Math.max(endTime - startTime, 5);
  
  // 가상의 차선 움직임 (왼쪽/오른쪽 이탈 시뮬레이션)
  const generateCarPath = () => {
    const points = [];
    const segments = 100;
    const centerY = roadY + laneHeight * 1.5; // 도로 중앙
    
    for (let i = 0; i < segments; i++) {
      const x = (width * i) / (segments - 1);
      let y = centerY;
      
      // 이벤트 발생 근처에서는 차선 이탈 시뮬레이션
      const progress = i / segments;
      const currentTime = startTime + timeRange * progress;
      
      const nearestEvent = sortedEvents.find(event => {
        const eventMinute = timeToMinutes(event.time);
        return Math.abs(eventMinute - currentTime) < 1;
      });
      
      if (nearestEvent) {
        // 이벤트 발생 위치에서 차선 이탈 (위 또는 아래)
        const isLeftDeparture = Math.random() > 0.5; // 50% 확률로 왼쪽/오른쪽 차선 이탈
        const offset = isLeftDeparture ? -laneHeight : laneHeight;
        
        // 이탈 시작과 복귀를 부드럽게
        const eventMinute = timeToMinutes(nearestEvent.time);
        const distanceFromEvent = Math.abs(eventMinute - currentTime);
        
        if (distanceFromEvent < 0.8) {
          // 가우시안 커브 형태로 이탈 (1에 가까울수록 중앙에서 멀어짐)
          const deviation = Math.exp(-Math.pow(distanceFromEvent * 2, 2));
          y += offset * deviation;
        }
      }
      
      points.push({ x, y });
    }
    
    return points;
  };
  
  const carPathPoints = generateCarPath();
  
  // SVG 경로 생성
  const createCarPath = () => {
    return carPathPoints.map((point, index) => 
      (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
    ).join(' ');
  };
  
  return (
    <View style={[styles.chartSpecialContainer, { height }]}>
      <Text style={styles.chartTitle}>차선 이탈 시각화</Text>
      
      <Svg width={width} height={chartHeight}>
        {/* 도로 배경 */}
        <Rect 
          x={0} y={roadY} 
          width={width} height={roadHeight} 
          fill="#E2E8F0" 
        />
        
        {/* 차선 그리기 */}
        <Line 
          x1={0} y1={roadY + laneHeight} 
          x2={width} y2={roadY + laneHeight}
          stroke="white" strokeWidth={3} strokeDasharray="10,10"
        />
        <Line 
          x1={0} y1={roadY + laneHeight * 2} 
          x2={width} y2={roadY + laneHeight * 2}
          stroke="white" strokeWidth={3} strokeDasharray="10,10"
        />
        
        {/* 운전 경로 */}
        <Path 
          d={createCarPath()} 
          stroke={ACCIDENT_COLORS.chart.purple}
          strokeWidth={4}
          fill="none"
        />
        
        {/* 이벤트 발생 지점 표시 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          const isLeftDeparture = index % 2 === 0; // 시뮬레이션: 짝/홀수 인덱스에 따라 왼쪽/오른쪽 이탈
          
          // 수정된 부분: 빨간점들을 도로 가장자리나 내부에 더 가깝게 배치
          const iconY = isLeftDeparture ? 
            roadY + laneHeight * 0.5 : // 왼쪽 차선 이탈 (첫번째 차선 중간)
            roadY + roadHeight - laneHeight * 0.5; // 오른쪽 차선 이탈 (마지막 차선 중간)
          
          return (
            <G key={`lane-event-${index}`}>
              <Circle cx={x} cy={iconY} r={8} fill={ACCIDENT_COLORS.chart.red} />
              <SvgText 
                x={x} 
                y={chartHeight} 
                fontSize={10}
                fill={ACCIDENT_COLORS.text.secondary}
                textAnchor="middle"
              >
                {event.formattedTime}
              </SvgText>
            </G>
          );
        })}
        
        {/* 시간 표시 */}
        <Line 
          x1={0} y1={chartHeight - 15} 
          x2={width} y2={chartHeight - 15}
          stroke={ACCIDENT_COLORS.chart.grid} strokeWidth={1}
        />
        
        {/* 차량 아이콘 */}
        <Circle 
          cx={carPathPoints[carPathPoints.length - 1].x - 5} 
          cy={carPathPoints[carPathPoints.length - 1].y} 
          r={8} 
          fill={ACCIDENT_COLORS.primary}
        />
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.purple }]} />
          <Text style={styles.legendText}>차량 경로</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.red }]} />
          <Text style={styles.legendText}>차선 이탈</Text>
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

export default LaneDepartureChart;