import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {LabeledInput} from '../../../components/common/input/LabeledInput.tsx';
import {LabeledValue} from '../../../components/common/display/LabeledValue.tsx';
import {BlueButton} from '../../../components/common/button/BlueButton.tsx';
import CustomModal from '../../../components/common/CustomModal.tsx';

type InfoProps = {
  name: string;
  nickname: string;
  setNickname: (nickname: string) => void;
  email: string;
  save: () => void;
  onWithdraw: () => void;
};

export default function MypageInfoScreen({
  name,
  nickname,
  setNickname,
  email,
  save,
  onWithdraw,
}: InfoProps) {
  const [withdrawVisible, setWithdrawVisible] = useState(false);

  return (
    <View style={styles.container}>
      <LabeledValue title="이름" content={name} />
      <LabeledInput
        title="닉네임"
        content={nickname}
        setContent={setNickname}
        placeholder="모디브"
      />
      <LabeledValue title="이메일" content={email} />
      <BlueButton title="저장" moveNext={save} />

      <View style={styles.withdrawWrapper}>
        <TouchableOpacity onPress={() => setWithdrawVisible(true)}>
          <Text style={styles.withdraw}>회원 탈퇴</Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={withdrawVisible}
        title="회원 탈퇴"
        content={['정말 탈퇴하시겠습니까?', '모든 정보가 비활성 처리됩니다.']}
        onClose={() => setWithdrawVisible(false)}
        onConfirm={() => {
          setWithdrawVisible(false);
          onWithdraw();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  withdrawWrapper: {
    marginTop: 'auto',
    alignItems: 'flex-start',
    paddingBottom: 100,
  },
  withdraw: {
    fontSize: 15,
    color: '#0F172A',
    opacity: 0.5,
    textDecorationLine: 'underline',
  },
});
