import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {RegisterInput} from '../../../components/Register/RegisterInput.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';

type Props = {
  text: string;
  setText: (text: string) => void;
  moveNext: () => void;
  setShowAlertModal: (visible: boolean) => void;
  setAlertMessage: (message: string) => void;
};

export default function RegisgerCarNumScreen({
  text,
  setText,
  moveNext,
  setShowAlertModal,
  setAlertMessage,
}: Props) {
  const handleNext = () => {
    if (!text.trim()) {
      setAlertMessage('차량 번호를 입력해주세요.');
      setShowAlertModal(true);
      return;
    }
    moveNext();
  };

  return (
    <View style={styles.page}>
      <RegisterHeader
        title="차량 번호를 입력해주세요."
        content="차량 정보를 바탕으로 주행 데이터를 분석해드릴게요."
      />
      <RegisterInput
        text={text}
        setText={setText}
        placeholder={'04히 2025'}
        isCount={false}
      />
      <BlueButton title="다음" moveNext={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    paddingHorizontal: 40,
  },
});
