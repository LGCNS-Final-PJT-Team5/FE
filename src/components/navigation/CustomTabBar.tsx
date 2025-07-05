import React, { useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Text 
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  // 각 탭 버튼에 대한 애니메이션 값 배열 생성
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // 탭 누를 때 애니메이션 실행
          Animated.sequence([
            // 누를 때 축소
            Animated.timing(animatedValues[index], {
              toValue: 0.8,
              duration: 100,
              useNativeDriver: true,
            }),
            // 다시 원래 크기로
            Animated.spring(animatedValues[index], {
              toValue: 1,
              friction: 4,
              tension: 40,
              useNativeDriver: true,
            }),
          ]).start();

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // 아이콘 설정
        const getIcon = () => {
          const size = 22;
          const color = isFocused ? '#4945FF' : 'gray';

          if (route.name === 'Home')
            return <AntDesign name="home" size={size} color={color} />;
          if (route.name === 'Drive')
            return <Feather name="pie-chart" size={size} color={color} />;
          if (route.name === 'Seed')
            return <MaterialCommunity name="seed-outline" size={size} color={color} />;
          if (route.name === 'User')
            return <Feather name="user" size={size} color={color} />;
        };

        // 선택된 탭에 표시할 인디케이터
        const renderIndicator = () => {
          if (isFocused) {
            return <View style={styles.indicator} />;
          }
          return null;
        };

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Animated.View 
              style={[
                styles.tabIconContainer,
                { transform: [{ scale: animatedValues[index] }] }
              ]}
            >
              {getIcon()}
              <Text style={[
                styles.tabLabel, 
                { color: isFocused ? '#4945FF' : 'gray' }
              ]}>
                {label}
              </Text>
              {renderIndicator()}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: width / 4 - 10,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#4945FF',
  }
});

export default CustomTabBar;