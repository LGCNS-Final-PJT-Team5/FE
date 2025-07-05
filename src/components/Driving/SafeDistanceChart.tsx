import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { ACCIDENT_COLORS } from '../../theme/colors';
import { FollowingDistanceEvent } from '../../types/report';

interface SafeDistanceChartProps {
  events: FollowingDistanceEvent[];
  height?: number;
}

const screenWidth = Dimensions.get('window').width;

const SafeDistanceChart: React.FC<SafeDistanceChartProps> = ({ events, height = 200 }) => {
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
  
  // 안전 거리 데이터 포인트 생성 (시뮬레이션)
  const generateDistanceData = () => {
    const points = [];
    const numPoints = 50;
    const safeDistance = chartHeight * 0.6; // 안전 거리 기준선
    
    for (let i = 0; i < numPoints; i++) {
      const minute = startTime + (timeRange * i / (numPoints - 1));
      let distance;
      
      // 이벤트 발생 근처에서는 안전거리 위반
      const isNearEvent = sortedEvents.some(event => {
        const eventMinute = timeToMinutes(event.time);
        return Math.abs(eventMinute - minute) < 2;
      });
      
      // 거리 값 시뮬레이션
      if (isNearEvent) {
        // 이벤트 근처: 안전거리보다 가까움 (위반)
        distance = safeDistance * (0.3 + Math.random() * 0.2);
      } else {
        // 일반 상황: 안전거리 이상
        distance = safeDistance * (0.8 + Math.random() * 0.5);
      }
      
      const x = ((minute - startTime) / timeRange) * width;
      const y = chartHeight - distance;
      
      points.push({ x, y, minute, distance });
    }
    return points;
  };
  
  const distanceData = generateDistanceData();
  
  // SVG 경로 생성
  const createDistancePath = () => {
    let path = distanceData.map((point, index) => 
      (index === 0 ? 'M' : 'L') + point.x + ',' + point.y
    ).join(' ');
    
    // 영역 채우기 위해 경로 닫기
    path += ` L${width},${chartHeight} L0,${chartHeight} Z`;
    return path;
  };
  
  const safeDistanceY = chartHeight * 0.4; // 안전 거리 기준선 (위에서부터)
  
  return (
    <View style={[styles.chartSpecialContainer, { height }]}>
      <Text style={styles.chartTitle}>차간 안전거리 변화</Text>
      
      <Svg width={width} height={chartHeight}>
        {/* 배경 영역: 안전/위험 구분 */}
        <Rect 
          x={0} y={0}
          width={width} height={safeDistanceY}
          fill="rgba(229, 62, 62, 0.1)" // 위험 영역: 빨간색
        />
        <Rect 
          x={0} y={safeDistanceY}
          width={width} height={chartHeight - safeDistanceY}
          fill="rgba(104, 211, 146, 0.1)" // 안전 영역: 녹색
        />
        
        {/* 안전 거리 기준선 */}
        <Line 
          x1={0} y1={safeDistanceY}
          x2={width} y2={safeDistanceY}
          stroke="#68D392" strokeWidth={2}
          strokeDasharray="5,5"
        />
        <SvgText 
          x={8} y={safeDistanceY - 5} 
          fill="#68D392" 
          fontSize={10}
        >
          권장 안전거리
        </SvgText>
        
        {/* 거리 변화 곡선 */}
        <Path 
          d={createDistancePath()}
          fill="rgba(187, 39, 255, 0.2)"
          stroke={ACCIDENT_COLORS.chart.purple}
          strokeWidth={3}
        />
        
        {/* 이벤트 발생 지점 */}
        {sortedEvents.map((event, index) => {
          const eventMinute = timeToMinutes(event.time);
          const x = ((eventMinute - startTime) / timeRange) * width;
          
          // 이벤트 발생 지점에서 실제 거리 찾기 (가장 가까운 데이터 포인트)
          const nearestPoint = distanceData.reduce((nearest, point) => {
            const currentDiff = Math.abs(point.minute - eventMinute);
            const nearestDiff = Math.abs(nearest.minute - eventMinute);
            return currentDiff < nearestDiff ? point : nearest;
          }, distanceData[0]);
          
          return (
            <G key={`distance-event-${index}`}>
              <Circle 
                cx={x} cy={nearestPoint.y} 
                r={6} 
                fill={ACCIDENT_COLORS.chart.red} 
              />
              <Line 
                x1={x} y1={nearestPoint.y}
                x2={x} y2={chartHeight}
                stroke={ACCIDENT_COLORS.chart.red}
                strokeWidth={1}
                strokeDasharray="3,3"
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
        
        {/* 범례 */}
        <SvgText x={8} y={15} fontSize={10} fill={ACCIDENT_COLORS.chart.red}>
          위험 구간
        </SvgText>
        <SvgText x={8} y={chartHeight - 5} fontSize={10} fill={ACCIDENT_COLORS.chart.green}>
          안전 구간
        </SvgText>
      </Svg>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.purple }]} />
          <Text style={styles.legendText}>실제 유지 거리</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: ACCIDENT_COLORS.chart.green }]} />
          <Text style={styles.legendText}>안전 거리</Text>
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

export default SafeDistanceChart;