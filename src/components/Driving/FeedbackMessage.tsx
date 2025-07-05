import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ACCIDENT_COLORS } from '../../theme/colors';

interface FeedbackMessageProps {
  title?: string;
  message: string;
  screenType?: 'accident' | 'safety' | 'carbon' | 'attention' | 'main';
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  title = "운전 피드백", 
  message,
  screenType = 'accident'
}) => {
  // 스크린 타입에 따른 색상 설정
  const getThemeColor = () => {
    switch(screenType) {
      case 'accident':
        return '#BB27FF'; // 보라색
      case 'safety':
        return '#68D392'; // 초록색 
      case 'carbon':
        return '#4299E1'; // 파란색
      case 'attention':
        return '#FFD927'; // 노란색
      case 'main':
        return '#4945FF'; // 서비스 메인 파란색
      default:
        return '#BB27FF';
    }
  };

  // 스크린 타입에 따른 배경색 설정
  const getBackgroundColor = () => {
    switch(screenType) {
      case 'accident':
        return 'rgba(187, 39, 255, 0.15)'; // 연한 보라색
      case 'safety':
        return 'rgba(104, 211, 146, 0.15)'; // 연한 초록색
      case 'carbon':
        return 'rgba(66, 153, 225, 0.15)'; // 연한 파란색
      case 'attention':
        return 'rgba(255, 217, 39, 0.15)'; // 연한 노란색
      case 'main':
        return 'rgba(73, 69, 255, 0.15)'; // 연한 메인 파란색
      default:
        return 'rgba(187, 39, 255, 0.15)';
    }
  };

  const themeColor = getThemeColor();
  const backgroundColor = getBackgroundColor();

  const containerStyle = {
    ...styles.feedbackContainer,
    backgroundColor: backgroundColor,
    borderLeftColor: themeColor
  };

  const titleStyle = {
    ...styles.feedbackTitle,
    color: themeColor
  };

  return (
    <View style={containerStyle}>
      <View style={styles.robotContainer}>
        <Image
          source={require('../../assets/modive_robot1.png')}
          style={styles.robotImage}
          accessibilityLabel="모디브 로봇 아이콘"
        />
      </View>
      <View style={styles.feedbackTextContainer}>
        <Text style={titleStyle}>{title}</Text>
        <Text style={styles.feedbackText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
  },
  robotContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  feedbackTextContainer: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default FeedbackMessage;