import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { ACCIDENT_COLORS } from '../../theme/colors';

interface GaugeChartProps {
  percentage: number;
  color: string;
  size?: number;
  gaugeBackgroundColor?: string;
  animated?: boolean; // 애니메이션 옵션 추가
  animationDuration?: number; // 애니메이션 지속 시간
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  percentage,
  color,
  size = 180,
  gaugeBackgroundColor = '#f0f0f0',
  animated = true, // 기본값 true
  animationDuration = 1500, // 애니메이션 지속 시간 (ms)
}) => {
  // 애니메이션 값 생성
  const animatedValue = useRef(new Animated.Value(0)).current;
  // 애니메이션 된 현재 퍼센티지 값
  const [currentPercentage, setCurrentPercentage] = React.useState(animated ? 0 : percentage);

  useEffect(() => {
    if (animated) {
      // 애니메이션 시작
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: animationDuration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true, // 성능 향상
      }).start();

      // 애니메이션 값 리스너 추가
      const listener = animatedValue.addListener(({ value }) => {
        setCurrentPercentage(value);
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }
  }, [percentage, animated, animationDuration]);

  const center = size / 2;
  const gaugeRadius = (size / 2) * 0.8;
  const strokeWidth = 20;

  // 게이지 각도 계산 - 반원형 차트 (180도)
  const gaugeStartAngle = -180;
  const gaugeEndAngle = gaugeStartAngle + (currentPercentage / 100) * 180;

  // 극좌표를 데카르트 좌표로 변환
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleDegrees: number,
  ) => {
    const angleRad = (angleDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleRad),
      y: centerY + r * Math.sin(angleRad),
    };
  };

  // 호 경로 생성
  const createArc = (
    x: number,
    y: number,
    r: number,
    startAng: number,
    endAng: number,
  ) => {
    const start = polarToCartesian(x, y, r, endAng);
    const end = polarToCartesian(x, y, r, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? '0' : '1';

    return [
      'M',
      start.x,
      start.y,
      'A',
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(' ');
  };

  const foregroundArc = createArc(
    center,
    center,
    gaugeRadius,
    gaugeStartAngle,
    gaugeEndAngle,
  );
  
  const backgroundArc = createArc(
    center,
    center,
    gaugeRadius,
    gaugeStartAngle,
    gaugeStartAngle + 180,
  );

  const displayValue = currentPercentage.toFixed(1);
  const ratingText =
    currentPercentage >= 70 ? 'Good' : currentPercentage >= 40 ? 'So-so' : 'Poor';

  // 반응형 폰트 크기 계산
  const scoreFontSize = size * 0.18 > 36 ? 36 : size * 0.18;
  const ratingFontSize = size * 0.12 > 24 ? 24 : size * 0.12;

  // 0과 100 텍스트 색상
  const labelTextColor = ACCIDENT_COLORS?.text?.light || '#718096';

  return (
    <View style={[styles.gaugeChartContainer, {height: size * 0.6}]}>
      <Svg width={size} height={size * 0.6}>
        {/* 배경 호 */}
        <Path
          d={backgroundArc}
          stroke={gaugeBackgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 전경 호 */}
        <Path
          d={foregroundArc}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* 게이지 끝 부분의 원 */}
        <Circle
          cx={polarToCartesian(center, center, gaugeRadius, gaugeEndAngle).x}
          cy={polarToCartesian(center, center, gaugeRadius, gaugeEndAngle).y}
          r={strokeWidth / 2}
          fill="#FFFFFF"
          stroke={color}
          strokeWidth={2}
        />

        {/* 점수 텍스트 */}
        <G x={center} y={center - 10}>
          <SvgText
            textAnchor="middle"
            fontSize={scoreFontSize}
            fontWeight="bold"
            fill={color}>
            {displayValue}
          </SvgText>
          <SvgText
            textAnchor="middle"
            fontSize={ratingFontSize}
            fontWeight="bold"
            fill={color}
            y={30}>
            {ratingText}
          </SvgText>
        </G>

        {/* 0과 100 표시 */}
        <SvgText x={10} y={center + 15} fontSize={12} fill={labelTextColor}>
          {'0'}
        </SvgText>
        <SvgText
          x={size - 22}
          y={center + 15}
          fontSize={12}
          fill={labelTextColor}>
          {'100'}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  gaugeChartContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginBottom: 0,
  },
});

export default GaugeChart;