import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
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
      iconSet: 'MaterialIcons',
      iconName: 'directions-car',
    },
    {
      nav: 'MypageInfo',
      name: '내 정보',
      iconSet: 'MaterialIcons',
      iconName: 'person',
    },
    {
      nav: 'MypageInterest',
      name: '내 관심사',
      iconSet: 'MaterialIcons',
      iconName: 'favorite',
    },
    {
      name: '로그아웃',
      iconSet: 'MaterialIcons',
      iconName: 'logout',
      isLogout: true,
    },
  ];

  return (
    <View style={styles.container}>
      <MypageProfile name={nickname} car={car} />
      <View style={styles.menuContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // 흰색으로 변경
  },
  menuContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#969696',
    marginBottom: 10,
    marginLeft: 5,
  },
});
