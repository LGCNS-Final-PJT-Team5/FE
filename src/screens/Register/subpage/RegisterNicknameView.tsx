import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RegisterHeader} from '../../../components/Register/RegisterHeader.tsx';
import {RegisterInput} from '../../../components/Register/RegisterInput.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';
import CustomModal from '../../../components/common/CustomModal.tsx';
import {authService} from '../../../services/api/authService.ts';

type NicknameProps = {
  text: string;
  setText: (text: string) => void;
  moveNext: () => void;
  setShowAlertModal: (visible: boolean) => void;
  setAlertMessage: (message: string) => void;
};

export default function RegisterNicknameView({
  text,
  setText,
  moveNext,
  setShowAlertModal,
  setAlertMessage,
}: NicknameProps) {
  const handleNext = async () => {
    const nickname = text.trim();
    console.log('닉네임:', nickname);

    if (!nickname) {
      setAlertMessage('닉네임을 입력해주세요.');
      setShowAlertModal(true);
      return;
    }

    // 닉네임 유효성 검사
    if (!/^[가-힣a-zA-Z0-9]{2,10}$/.test(nickname)) {
      setAlertMessage(
        '닉네임은 2~10자의 한글, 영문, 숫자만 사용할 수 있습니다.',
      );
      setShowAlertModal(true);
      return;
    }

    try {
      const isExists = await authService.checkDuplicateNickname(nickname);

      if (isExists) {
        setAlertMessage('이미 사용 중인 닉네임입니다.');
        setShowAlertModal(true);
        return;
      }

      moveNext();
    } catch (error) {
      console.error(error);
      setAlertMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setShowAlertModal(true);
    }
  };

  return (
    <View style={styles.page}>
      <RegisterHeader
        title="닉네임을 입력해주세요."
        content="모디브에서 사용할 이름이에요."
      />
      <RegisterInput
        text={text}
        setText={setText}
        placeholder="모디브"
        isCount={true}
        maxLength={10}
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
