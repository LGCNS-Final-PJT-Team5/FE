import React from 'react';
import {View, Text, Switch, StyleSheet, Alert} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {UserResponse} from '../../../types/user';
import {userService} from '../../../services/api/userService';
import {useUserStore} from '../../../store/useUserStore';

type ProfileHeaderProps = {
  userInfo: UserResponse;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ProfileHeader({
  userInfo,
  isEnabled,
  setIsEnabled,
}: ProfileHeaderProps) {
  const handleToggle = async () => {
    const newValue = !isEnabled;

    try {
      useUserStore.getState().setAlarm(newValue); // 상태 업데이트
      await userService.updateAlarm(newValue);
      setIsEnabled(newValue); // 로컬 UI 상태 반영
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      Alert.alert('오류', '알림 설정을 변경하는 데 실패했습니다.');
    }
  };

  return (
    <View style={styles.profileHeader}>
      <Text style={styles.username}>
        <Text style={styles.highlight}>{userInfo.nickname}</Text>님의 운전
        프로필
      </Text>
      <View style={styles.toggleArea}>
        <Feather name="volume-2" size={22} color="#4945FF" />
        <Switch
          trackColor={{false: '#767577', true: '#4945FF'}}
          thumbColor="#fff"
          onValueChange={handleToggle}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  username: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  highlight: {
    fontSize: 20,
    color: '#4945FF',
    fontWeight: 'bold',
  },
  toggleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
