import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

interface HeaderDropdownProps {
  currentScreen: string;
  textColor?: string;
  primaryColor?: string;
  driveId?: string; // driveId 옵션으로 추가
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  currentScreen,
  textColor = '#2D3748',
  primaryColor = '#BB27FF',
  driveId, // driveId 받기
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-20));
  const navigation = useNavigation();
  const route = useRoute();
  
  // route.params에서 driveId를 얻거나 props로 전달된 것을 사용
  const currentDriveId = driveId || route.params?.driveId;

  const menuItems = [
    { id: 'carbon', title: '탄소 배출 및 연비 점수', route: 'CarbonEmissionReport', color: '#007AFF' },
    { id: 'safety', title: '안전운전 점수', route: 'SafetyReport', color: '#4ECD7B' },
    { id: 'accident', title: '사고 예방 점수', route: 'AccidentPreventionReport', color: '#BB27FF' },
    { id: 'attention', title: '주의력 점수', route: 'AttentionScoreReport', color: '#FFD927' },
  ];

  const toggleDropdown = () => {
    // 기존 코드 유지
    if (!isDropdownVisible) {
      setIsDropdownVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsDropdownVisible(false);
      });
    }
  };

  const navigateToScreen = (routeName: string) => {
    toggleDropdown();
    if (routeName !== route.name) {
      setTimeout(() => {
        // navigate 대신 replace 사용하여 항상 새 인스턴스 생성
        // driveId가 있으면 파라미터로 전달
        if (currentDriveId) {
          // @ts-ignore - 네비게이션 타입 문제 무시
          navigation.replace(routeName, { driveId: currentDriveId });
          console.log(`HeaderDropdown: ${routeName}로 이동, driveId=${currentDriveId}`);
        } else {
          // driveId가 없는 경우 (드문 경우)
          // @ts-ignore
          navigation.replace(routeName);
          console.log(`HeaderDropdown: ${routeName}로 이동, driveId 없음`);
        }
      }, 150);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        activeOpacity={0.7}
        onPress={toggleDropdown}>
        <Text style={[styles.currentScreenText, { color: textColor }]}>
          {menuItems.find(item => item.id === currentScreen)?.title || currentScreen}
        </Text>
        <Icon
          name={isDropdownVisible ? "chevron-up" : "chevron-down"}
          size={14}
          color={textColor}
          style={styles.dropdownIcon}
        />
      </TouchableOpacity>

      {/* 나머지 모달 코드는 그대로 유지 */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="none"
        onRequestClose={toggleDropdown}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleDropdown}>
          <Animated.View
            style={[
              styles.dropdownMenu,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  currentScreen === item.id && { backgroundColor: `${item.color}15` },
                ]}
                onPress={() => navigateToScreen(item.route)}>
                <View style={[styles.menuItemIndicator, { backgroundColor: item.color }]} />
                <Text
                  style={[
                    styles.menuItemText,
                    currentScreen === item.id && { fontWeight: '700', color: item.color },
                  ]}>
                  {item.title}
                </Text>
                {currentScreen === item.id && (
                  <Icon name="check" size={16} color={item.color} />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  currentScreenText: {
    fontSize: 20,
    fontWeight: '600',
  },
  dropdownIcon: {
    marginLeft: 5,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
  },
  dropdownMenu: {
    marginTop: 60, // 헤더 아래 위치
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
  },
});

export default HeaderDropdown;