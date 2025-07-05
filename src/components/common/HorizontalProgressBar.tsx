import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // 이 라이브러리 필요

interface HorizontalProgressBarProps {
  progress: number; // 0~1 사이 값 (예: 0.75 = 75%)
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  value?: number | string;
  style?: any;
  textColor?: string;
  useGradient?: boolean;
  gradientColors?: string[];
}

/**
 * 재사용 가능한 가로형 프로그레스 바 컴포넌트
 */
const HorizontalProgressBar: React.FC<HorizontalProgressBarProps> = ({
  progress,
  width = 300,
  height = 30,
  color = '#4945FF',
  backgroundColor = 'rgba(73, 69, 255, 0.2)',
  label,
  showPercentage = false, // 기본값을 false로 변경
  showValue = false,
  value,
  style,
  textColor = '#333',
  useGradient = false,
  gradientColors,
}) => {
  // 진행률이 0~1 사이 값이 되도록 보정
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  
  // 기본 그라데이션 색상
  const defaultGradientColors = [
    `${color}FF`, // 끝 부분 (완전 불투명)
    `${color}AA`, // 중간 부분 (약간 투명)
  ];
  
  // 사용할 그라데이션 색상
  const colors = gradientColors || defaultGradientColors;
  
  return (
    <View style={[styles.progressBarContainer, style]}>
      {label && <Text style={[styles.progressBarLabel, { color: textColor }]}>{label}</Text>}
      <View
        style={[
          styles.progressBarBackground,
          { width, height, backgroundColor },
        ]}>
        {useGradient ? (
          <LinearGradient
            colors={colors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[
              styles.progressBarFill,
              {
                width: `${safeProgress * 100}%`,
                height,
              },
            ]}
          />
        ) : (
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${safeProgress * 100}%`,
                height,
                backgroundColor: color,
              },
            ]}
          />
        )}
        
        {showPercentage && (
          <Text style={[styles.progressBarText, { color: textColor }]}>
            {Math.round(safeProgress * 100)}%
          </Text>
        )}
        {showValue && (
          <Text style={[styles.progressBarText, { color: textColor }]}>
            {value}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarBackground: {
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarFill: {
    borderRadius: 15,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressBarText: {
    fontSize: 14,
    fontWeight: '700',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: 10,
  },
});

export default HorizontalProgressBar;