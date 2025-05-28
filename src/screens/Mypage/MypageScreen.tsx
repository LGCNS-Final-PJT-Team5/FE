import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MypageCard} from '../../components/Mypage/MypageCard.tsx';
import {MypageProfile} from '../../components/Mypage/MypageProfile.tsx';

type MypageProps = {
  nickname: string;
  car: string;
  navigation: any;
  onLogout: () => void; // 추가
};

// @ts-ignore
export default function MypageScreen({
  nickname,
  car,
  navigation,
  onLogout,
}: MypageProps) {
  const navInfo = [
    {
      nav: 'MypageCar',
      name: '내 차 정보',
      iconSet: 'MaterialCommunityIcons',
      iconName: 'car',
    },
    {
      nav: 'MypageInfo',
      name: '내 정보',
      iconSet: 'Feather',
      iconName: 'user',
    },
    {
      nav: 'MypageInterest',
      name: '내 관심사',
      iconSet: 'Feather',
      iconName: 'heart',
    },
    {
      name: '로그아웃',
      iconSet: 'Feather',
      iconName: 'log-out',
      isLogout: true,
    },
  ];

  return (
    <View style={styles.container}>
      <MypageProfile name={nickname} car={car} />
      <Text style={styles.sectionTitle}>계정</Text>
      {navInfo.map((item, index) => {
        return (
          <MypageCard
            key={index}
            index={index}
            item={item}
            navigation={navigation}
            onLogout={onLogout}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#969696',
    marginBottom: 10,
    marginLeft: 5,
  },
});
