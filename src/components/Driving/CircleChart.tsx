import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface CircleChartProps {
  percentage: number;
  radius: number;
  color: string;
}

const CircleChart: React.FC<CircleChartProps> = ({ 
  percentage, 
  radius, 
  color 
}) => {
  const center = radius + radius * 0.1;
  const startAngle = -90;
  const endAngle = 360 * (percentage / 100) - 90;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const createArc = (
    x: number,
    y: number,
    r: number,
    start: number,
    end: number,
  ) => {
    const s = polarToCartesian(x, y, r, end);
    const e = polarToCartesian(x, y, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${e.x} ${e.y}`;
  };

  const fullCirclePath = `M ${center},${
    center - radius
  } a ${radius},${radius} 0 1,0 0,${2 * radius} a ${radius},${radius} 0 1,0 0,${
    -2 * radius
  }`;
  
  const progressPath =
    percentage >= 100
      ? fullCirclePath
      : createArc(center, center, radius, startAngle, endAngle);

  return (
    <View style={styles.circleContainer}>
      <Svg width={center * 2} height={center * 2}>
        <Path
          d={fullCirclePath}
          stroke={`${color}20`}
          strokeWidth={radius * 0.1}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={progressPath}
          stroke={color}
          strokeWidth={radius * 0.1}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <Text style={[styles.circleText, {fontSize: radius * 0.5, color}]}>
        {Math.round(percentage)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    position: 'absolute',
    fontWeight: 'bold',
  },
});

export default CircleChart;