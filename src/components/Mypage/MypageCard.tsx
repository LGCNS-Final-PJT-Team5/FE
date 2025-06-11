import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {authService} from '../../services/api/authService';

type item = {
  nav?: string;
  name: string;
  iconSet: string;
  iconName: string;
  isLogout?: boolean;
};

type CardProps = {
  index: number;
  item: item;
  navigation: any;
  onLogout: () => void; // 추가
};

const iconSetMap: {[key: string]: typeof Feather} = {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
};

const getIconColor = (iconName: string, isLogout?: boolean) => {
  if (isLogout) return '#999999';

  switch (iconName) {
    case 'directions-car':
      return '#3F5AF0'; // 블루
    case 'person':
      return '#4338CA'; // 인디고
    case 'favorite':
      return '#E53E3E'; // 빨강
    default:
      return '#666666'; // 기본 회색
  }
};

const getIconBackgroundStyle = (iconName: string, isLogout?: boolean) => {
  const baseStyle = {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  };

  if (isLogout) {
    return {
      ...baseStyle,
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };
  }

  switch (iconName) {
    case 'directions-car':
      return {...baseStyle, backgroundColor: '#E8EFFF'}; // 좋 더 진한 블루
    case 'person':
      return {...baseStyle, backgroundColor: '#E0E7FF'}; // 인디고 스러운 연한색
    case 'favorite':
      return {...baseStyle, backgroundColor: '#FFEAEA'}; // 연한 빨강
    default:
      return {...baseStyle, backgroundColor: '#F5F5F5'}; // 기본 회색
  }
};

export const MypageCard = ({index, item, navigation, onLogout}: CardProps) => {
  const IconComponent = iconSetMap[item.iconSet];

  return (
    <TouchableOpacity
      key={index}
      style={
        item.isLogout ? styles.EditContainer : styles.EditContainerWithBorder
      }
      activeOpacity={0.9}
      onPress={() => {
        if (item.nav) {
          navigation.navigate(item.nav);
        } else {
          onLogout(); // 로그아웃 처리
        }
      }}>
      <View style={styles.EditHeader}>
        <View
          style={[
            getIconBackgroundStyle(item.iconName, item.isLogout),
            item.isLogout && styles.iconCircleLogout,
          ]}>
          <IconComponent
            name={item.iconName}
            size={20}
            color={getIconColor(item.iconName, item.isLogout)}
          />
        </View>
        <Text style={[item.isLogout ? styles.logout : styles.EditTitle]}>
          {item.name}
        </Text>
      </View>
      {!item.isLogout && (
        <Feather name="chevron-right" size={20} color="#c4c4c4" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  EditContainer: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  EditContainerWithBorder: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  EditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  EditTitle: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 16,
    fontWeight: '500',
  },
  iconCircleLogout: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  logout: {
    fontSize: 16,
    color: '#999999',
    marginLeft: 16,
    fontWeight: '500',
  },
});
