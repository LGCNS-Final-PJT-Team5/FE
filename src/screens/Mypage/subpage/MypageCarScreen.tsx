import React, {useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import CustomModal from '../../../components/common/CustomModal';
import {BlueButton} from '../../../components/common/button/BlueButton';
import {MypageCarList} from '../../../components/Mypage/MypageCarList';
import {Car} from '../../../types/Mypage';

interface MypageCarProps {
  cars: Car[];
  addCar: (number: string) => void;
  deleteCar: (carId: number) => void;
  onRequestSetCar: (carId: number) => void;
  modalVisible: boolean;
  onConfirmSetCar: () => void;
  onCloseModal: () => void;
}

export default function MypageCarScreen({
  cars,
  addCar,
  deleteCar,
  onRequestSetCar,
  modalVisible,
  onConfirmSetCar,
  onCloseModal,
}: MypageCarProps) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCarNumber, setNewCarNumber] = useState('');
  const isValid = newCarNumber.trim().length > 0;

  return (
    <>
      <View style={styles.container}>
        <MypageCarList
          cars={cars}
          onRequestSetCar={onRequestSetCar}
          onDeleteCar={deleteCar}
        />
        <BlueButton
          title={'+ 차량 추가'}
          moveNext={() => setAddModalVisible(true)}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        title="이 차량으로 등록할까요?"
        content={['선택한 차량으로 설정돼요.', '나중에 언제든 바꿀 수 있어요.']}
        onClose={onCloseModal}
        onConfirm={onConfirmSetCar}
      />
      <CustomModal
        visible={addModalVisible}
        title="차량 번호 등록"
        contentElement={
          <TextInput
            style={styles.input}
            placeholder="차량 번호를 입력하세요"
            value={newCarNumber}
            onChangeText={setNewCarNumber}
          />
        }
        onClose={() => setAddModalVisible(false)}
        onDismiss={() => setNewCarNumber('')}
        onConfirm={() => {
          if (!isValid) return;
          addCar(newCarNumber);
          setAddModalVisible(false);
        }}
        confirmText="등록"
        confirmDisabled={!isValid}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
});
