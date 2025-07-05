import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import GaugeChart from './GaugeChart';
import HeaderDropdown from '../common/HeaderDropdown';
import { 
  SAFETY_COLORS, 
  CARBON_COLORS, 
  ACCIDENT_COLORS,
  ATTENTION_COLORS
} from '../../theme/colors';

interface ReportHeaderSectionProps {
  score: number;
  onBackPress: () => void;
  screenType: 'safety' | 'carbon' | 'accident' | 'attention';
  filterOptions?: string[];
  onFilterChange?: (option: string) => void;
  selectedFilter?: string;
}

const ReportHeaderSection: React.FC<ReportHeaderSectionProps> = ({
  score,
  onBackPress,
  screenType,
  filterOptions = [],
  onFilterChange,
  selectedFilter,
}) => {
  // 화면 타입에 따른 색상 및 제목 설정
  const getScreenConfig = () => {
    switch (screenType) {
      case 'safety':
        return {
          title: '안전 운전 점수',
          color: SAFETY_COLORS.chart.green,
          bgColor: SAFETY_COLORS.bg.light,
        };
      case 'carbon':
        return {
          title: '친환경 운전 점수',
          color: CARBON_COLORS.chart.blue,
          bgColor: CARBON_COLORS.bg.light,
        };
      case 'accident':
        return {
          title: '사고 예방 점수',
          color: ACCIDENT_COLORS.chart.purple,
          bgColor: ACCIDENT_COLORS.bg.light,
        };
      case 'attention':
        return {
          title: '주의력 점수',
          color: ATTENTION_COLORS.chart.yellow,
          bgColor: ATTENTION_COLORS.bg.light,
        };
      default:
        return {
          title: '운전 점수',
          color: '#4A5568',
          bgColor: '#f5f5f5',
        };
    }
  };

  const { title, color, bgColor } = getScreenConfig();

  // 필터 옵션이 제공되면 커스텀 필터 드롭다운 표시
  const renderFilterDropdown = () => {
    if (filterOptions.length > 0) {
      return (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => onFilterChange && onFilterChange(selectedFilter || filterOptions[0])}
        >
          <Text style={styles.filterText}>
            {selectedFilter || filterOptions[0]}
          </Text>
          <Icon name="chevron-down" size={18} color="#333" />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: bgColor }]}>
      {/* 상단 헤더 영역 - 뒤로가기, 제목, 필터 버튼을 수평으로 정렬 */}
      <View style={styles.headerTopSection}>
        {/* 왼쪽 - 뒤로가기 버튼 */}
        <TouchableOpacity style={styles.navButton} onPress={onBackPress}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* 중앙 - 헤더 드롭다운 */}
        <HeaderDropdown 
          currentScreen={screenType} 
          textColor="#1A202C" 
          primaryColor={color}
        />
        
        {/* 오른쪽 - 필터 버튼 또는 플레이스홀더 */}
        {filterOptions.length > 0 ? (
          renderFilterDropdown()
        ) : (
          <View style={styles.navButton} />
        )}
      </View>
      
      {/* 게이지 차트 - 애니메이션 활성화 */}
      <GaugeChart 
        percentage={score} 
        color={color}
        size={250}
        gaugeBackgroundColor="#E2E8F0"
        animated={true}
        animationDuration={1500}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 16,
  },
  headerTopSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  filterText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    marginRight: 6,
  },
});

export default ReportHeaderSection;