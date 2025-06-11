import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SAFETY_COLORS } from '../../theme/colors';

// 화면 너비 가져오기
const screenWidth = Dimensions.get('window').width;

const AccelerationChart = ({ data, title, height, count }) => {
  // 데이터가 없는 경우 처리
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noDataText}>데이터가 없습니다</Text>
      </View>
    );
  }

  // 차트 컨테이너의 총 너비 계산 (데이터 항목당 최소 100픽셀)
  const totalWidth = Math.max(data.length * 100, screenWidth - 40);
  
  // 각 막대 간 간격 계산
  const barSpacing = totalWidth / (data.length + 1);

  return (
    <View style={styles.chartContainer}>
      {/* 급가감속 횟수 표시 */}
      <Text style={styles.countText}>총 급가감속 발생 횟수: {count || data.length}회</Text>
      
      {/* 가로 스크롤 적용 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ 
          width: totalWidth,
          paddingHorizontal: 10
        }}
      >
        <View style={[styles.container, { height, width: totalWidth }]}>
          {/* 그래프 영역 */}
          <View style={styles.chartArea}>
            {/* 수평선 (기준선) */}
            <View style={styles.baselineContainer}>
              <View style={styles.baseline} />
            </View>
            
            {/* 막대 그래프들 */}
            <View style={styles.barsContainer}>
              {data.map((item, index) => {
                // 각 막대의 x 위치 계산 (균등하게 분배)
                const xPosition = (index + 1) * barSpacing - (item.minWidth || 40) / 2;
                
                return (
                  <View 
                    key={`bar-${index}`} 
                    style={[
                      styles.barItem,
                      { 
                        left: xPosition,
                        height: item.value,
                        width: item.minWidth || 40
                      }
                    ]}
                  >
                    {/* 막대 그래프 */}
                    <View style={styles.barFill} />
                    
                    {/* 레이블 */}
                    <View style={styles.barTop}>
                      <Text style={styles.barLabel}>{item.label}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            
            {/* 시간 레이블 */}
            <View style={styles.timeLabelsContainer}>
              {data.map((item, index) => {
                const xPosition = (index + 1) * barSpacing - 25;
                return (
                  <Text 
                    key={`time-${index}`} 
                    style={[styles.timeLabel, { left: xPosition }]}
                  >
                    {item.detail}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#f9fdf9',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  container: {
    width: '100%',
    position: 'relative',
    marginTop: 20
  },
  chartArea: {
    flex: 1,
    position: 'relative'
  },
  baselineContainer: {
    position: 'absolute',
    bottom: 40, // 시간 레이블 공간 확보
    width: '100%',
    alignItems: 'center'
  },
  baseline: {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0'
  },
  barsContainer: {
    flex: 1,
    position: 'relative'
  },
  barItem: {
    position: 'absolute',
    bottom: 40, // 시간 레이블 공간 확보
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#7bcd85', // 앱 테마 녹색으로 변경
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  barTop: {
    position: 'absolute',
    top: -28,
    width: '100%',
    alignItems: 'center'
  },
  barLabel: {
    color: '#4a6c50',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(123, 205, 133, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeLabelsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40
  },
  timeLabel: {
    position: 'absolute',
    color: '#555',
    fontSize: 12,
    width: 50,
    textAlign: 'center',
    fontWeight: '500'
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4a6c50', // 녹색 테마에 맞는 어두운 녹색으로 변경
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123, 205, 133, 0.2)',
    paddingBottom: 12,
  }
});

export default AccelerationChart;