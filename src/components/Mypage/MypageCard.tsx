import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
};

export const MypageCard = ({index, item, navigation, onLogout}: CardProps) => {
  const IconComponent = iconSetMap[item.iconSet];

  return (
    <TouchableOpacity
      key={index}
      style={styles.EditContainer}
      onPress={() => {
        if (item.nav) {
          navigation.navigate(item.nav);
        } else {
          onLogout(); // 로그아웃 처리
        }
      }}>
      <View style={styles.EditHeader}>
        <View
          style={[styles.iconCircle, item.isLogout && styles.iconCircleLogout]}>
          <IconComponent
            name={item.iconName}
            size={20}
            color={item.isLogout ? '#FF0000' : '#3F5AF0'}
          />
        </View>
        <Text
          style={[
            item.isLogout ? styles.logout : styles.EditTitle,
            item.isLogout && {marginLeft: 16},
          ]}>
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
    padding: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  EditHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  EditTitle: {
    fontSize: 16,
    color: '#0F172A',
    marginLeft: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: '#F1F5FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleLogout: {
    backgroundColor: '#FFE5E5',
  },
  logout: {
    fontSize: 16,
    color: '#FF0000',
    marginLeft: 10,
  },
});
