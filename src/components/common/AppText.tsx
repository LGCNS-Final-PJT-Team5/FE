import React from 'react';
import { Text, TextProps } from 'react-native';

interface AppTextProps extends TextProps {
  bold?: boolean;
  medium?: boolean;
  light?: boolean;
}

const AppText: React.FC<AppTextProps> = ({ 
  style, 
  children, 
  bold, 
  medium, 
  light,
  ...props 
}) => {
  // 기본 폰트는 Regular, 속성에 따라 다른 폰트 가중치 적용
  let fontFamily = 'Pretendard-Regular';
  
  if (bold) fontFamily = 'Pretendard-Bold';
  else if (medium) fontFamily = 'Pretendard-Medium';
  else if (light) fontFamily = 'Pretendard-Light';

  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;