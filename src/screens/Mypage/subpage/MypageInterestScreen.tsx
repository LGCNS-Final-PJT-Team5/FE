import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {InterestCategory} from '../../../components/common/InterestCategory.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';

type InterestProps = {
  value: string;
  setValue: (text: string) => void;
  setInterest: () => void;
};

const categories = [
  '연비', '보험료',
  '초보운전', '앱테크',
  '차량 관리', '탄소 절감',
  '드라이브 스타', '드라이빙 테크닉',
];

export default function MypageInterestScreen({ value, setValue, setInterest }: InterestProps) {
  return (
    <View style={styles.container}>
      <RegisterHeader
        title={'관심 있는 항목을 선택해주세요.'}
        content={'선택한 관심사를 중심으로 리포트를 구성해드릴게요. 변경된 관심사는 다음 주간 주행 리포트부터 반영됩니다.'}
        top={true}
      />
      <InterestCategory
        value={value}
        setValue={setValue}
        categories={categories}
      />
      <BlueButton
        title={'완료'}
        moveNext={setInterest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 40,
    paddingVertical: 100,
  },
});

