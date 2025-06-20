import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, G, Circle, Text as SvgText } from 'react-native-svg';
import { ACCIDENT_COLORS } from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

interface TimelineEvent {
  time: string;
  formattedTime: string;
}

interface TimelineChartProps {
  events: TimelineEvent[];
  title: string;
  height?: number;
  showMarkers?: boolean;
  startTime?: string; // 주행 시작 시간
  endTime?: string;   // 주행 종료 시간
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  events,
  title,
  height = 200,
  showMarkers = true,
  startTime,
  endTime,
}) => {
  const width = screenWidth - 80;
  
  // 시간을 분 단위로 변환
  const timeToMinutes = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.getHours() * 60 + date.getMinutes() + (date.getSeconds() / 60);
  };
  
  // 이벤트를 시간순으로 정렬
  const sortedEvents = [...events].sort((a, b) => 
    timeToMinutes(a.time) - timeToMinutes(b.time)
  );
  
  // 주행 시작/종료 시간 계산 (제공된 값이 없으면 이벤트에서 추출)
  let chartStartTime = startTime ? timeToMinutes(startTime) : 0;
  let chartEndTime = endTime ? timeToMinutes(endTime) : 0;
  
  // 이벤트가 있으면 시작/종료 시간 계산
  if (sortedEvents.length > 0) {
    // 명시적으로 시작/종료 시간이 제공되지 않은 경우에만 이벤트에서 추출
    if (!startTime) {
      chartStartTime = timeToMinutes(sortedEvents[0]?.time) - 5; // 여유 추가
    }
    if (!endTime) {
      chartEndTime = timeToMinutes(sortedEvents[sortedEvents.length - 1]?.time) + 5; // 여유 추가
    }
  }
  
  // 타임라인 시간 범위 (최소 30분, 최대 실제 주행 시간)
  const timeRange = Math.max(chartEndTime - chartStartTime, 3);
  
  // 시간 레이블 충돌 방지를 위한 간격 계산
  const getTimeLabelsCount = () => {
    const maxLabels = Math.floor(width / 70); // 각 레이블에 최소 70px 공간
    return Math.min(Math.ceil(timeRange / 5), maxLabels);
  };
  
  // 시간 레이블 간격 계산
  const timeLabelsInterval = Math.max(5, Math.ceil(timeRange / getTimeLabelsCount()));
  
  return (
    <View style={[styles.timelineContainer, { height }]}>
      <Text style={styles.timelineTitle}>{title}</Text>
      
      <Svg width={width} height={height - 40}>
        {/* 타임라인 기본선 */}
        <Line 
          x1={0} 
          y1={height / 2} 
          x2={width} 
          y2={height / 2} 
          stroke={ACCIDENT_COLORS.chart.grid} 
          strokeWidth={2} 
        />
        
        {/* 시간 눈금 (동적 간격) */}
        {Array.from({ length: Math.ceil(timeRange / timeLabelsInterval) + 1 }).map((_, i) => {
          const tickTime = chartStartTime + i * timeLabelsInterval;
          const tickX = ((tickTime - chartStartTime) / timeRange) * width;
          const hours = Math.floor(tickTime / 60);
          const minutes = Math.floor(tickTime % 60);
          const timeLabel = `${hours}:${minutes.toString().padStart(2, '0')}`;
          
          return (
            <G key={`tick-${i}`}>
              <Line 
                x1={tickX} 
                y1={height / 2 - 5} 
                x2={tickX} 
                y2={height / 2 + 5} 
                stroke={ACCIDENT_COLORS.chart.grid} 
                strokeWidth={1} 
              />
              <SvgText 
                x={tickX} 
                y={height / 2 + 20} 
                fontSize={10} 
                fill={ACCIDENT_COLORS.text.secondary}
                textAnchor="middle"
              >
                {timeLabel}
              </SvgText>
            </G>
          );
        })}
        
        {/* 이벤트 마커 - 충돌 방지 로직 추가 */}
        {showMarkers && sortedEvents.map((event, index) => {
          const eventTime = timeToMinutes(event.time);
          const eventX = Math.max(0, Math.min(width, ((eventTime - chartStartTime) / timeRange) * width));
          
          // 인접 마커와의 최소 거리 계산 (충돌 방지)
          const isCloseToNextEvent = index < sortedEvents.length - 1 && 
            (timeToMinutes(sortedEvents[index + 1].time) - eventTime) < (timeRange / 20);
          
          return (
            <TimelineMarker 
              key={`marker-${index}`} 
              x={eventX} 
              y={height / 2} 
              color={ACCIDENT_COLORS.chart.purple}
              time={event.formattedTime}
              showLabel={!isCloseToNextEvent || index % 2 === 0} // 레이블 충돌 방지
            />
          );
        })}
      </Svg>
    </View>
  );
};

// 타임라인 점 마커 컴포넌트 개선
const TimelineMarker = ({
  x,
  y,
  color,
  time,
  showLabel = true,
}: {
  x: number;
  y: number;
  color: string;
  time: string;
  showLabel?: boolean;
}) => (
  <G>
    <Circle cx={x} cy={y} r={6} fill={color} />
    {showLabel && (
      <SvgText
        x={x}
        y={y - 10}
        fontSize={8}
        fill={ACCIDENT_COLORS.text.secondary}
        textAnchor="middle">
        {time}
      </SvgText>
    )}
  </G>
);

const styles = StyleSheet.create({
  timelineContainer: {
    width: '100%',
    marginVertical: 16,
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ACCIDENT_COLORS.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default TimelineChart;

