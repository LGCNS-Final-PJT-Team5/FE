import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';
import {InterestCategory} from '../../../components/common/InterestCategory.tsx';

type InterestProps = {
  value: string;
  setValue: (text: string) => void;
  register: () => void;
  setShowAlertModal: (visible: boolean) => void;
  setAlertMessage: (message: string) => void;
};

const categories = [
  '연비',
  '보험료',
  '초보운전',
  '앱테크',
  '차량 관리',
  '탄소 절감',
  '드라이브 스타',
  '드라이빙 테크닉',
];

export default function RegisterInterestScreen({
  value,
  setValue,
  register,
  setShowAlertModal,
  setAlertMessage,
}: InterestProps) {
  const handleRegister = () => {
    if (!value.trim()) {
      setAlertMessage('관심 항목을 선택해주세요.');
      setShowAlertModal(true);
      return;
    }
    register();
  };

  return (
    <View style={styles.page}>
      <RegisterHeader
        title={'관심 있는 항목을 선택해주세요.'}
        content={'선택한 관심사를 중심으로 리포트를 구성해드릴게요.'}
        top={true}
      />
      <InterestCategory
        value={value}
        setValue={setValue}
        categories={categories}
      />
      <BlueButton title={'완료'} moveNext={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    paddingHorizontal: 40,
  },
});
