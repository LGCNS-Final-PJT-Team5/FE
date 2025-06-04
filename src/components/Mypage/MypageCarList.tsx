import React, {useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Car} from '../../types/Mypage';
import Feather from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actionsheet';
import CustomModal from '../common/CustomModal';

type CarProps = {
  car: Car;
  onRequestSetCar: (carId: number) => void;
  onDeleteCar: (carId: number) => void;
};

const CarComponent = ({car, onRequestSetCar, onDeleteCar}: CarProps) => {
  const actionSheetRef = useRef<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [warnVisible, setWarnVisible] = useState(false);

  const handleMenuPress = () => {
    actionSheetRef.current?.show();
  };

  const handleAction = (index: number) => {
    if (index === 0) {
      if (car.active) {
        setWarnVisible(true);
      } else {
        setMenuVisible(true);
      }
    }
  };

  return (
    <>
      <View style={car.active ? styles.selectedBlock : styles.carContainer}>
        {/* 카드 전체 Touchable */}
        <TouchableOpacity
          style={styles.touchableArea}
          activeOpacity={0.8}
          onPress={() => onRequestSetCar(car.carId)}>
          <View style={styles.left}>
            <Text style={styles.number}>{car.number}</Text>
            {car.active && <Text style={styles.selectedText}>현재 차량</Text>}
          </View>
        </TouchableOpacity>

        {/* 케밥 메뉴는 별도 Touchable */}
        <TouchableOpacity
          onPress={handleMenuPress}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Feather name="more-horizontal" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      {/* ActionSheet 메뉴 */}
      <ActionSheet
        ref={actionSheetRef}
        options={['차량 삭제', '취소']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={handleAction}
      />

      {/* 삭제 확인 모달 */}
      <CustomModal
        visible={menuVisible}
        title="정말 삭제하시겠습니까?"
        content={['해당 차량에 대한 정보가 삭제됩니다.']}
        onClose={() => setMenuVisible(false)}
        onConfirm={() => {
          setMenuVisible(false);
          onDeleteCar(car.carId);
        }}
      />

      {/* 선택된 차량 삭제 시 경고 모달 */}
      <CustomModal
        visible={warnVisible}
        title="삭제할 수 없습니다."
        content={['선택된 차량은 삭제할 수 없습니다.']}
        onClose={() => setWarnVisible(false)}
        isAlert
      />
    </>
  );
};

type ListProps = {
  cars: Car[];
  onRequestSetCar: (carId: number) => void;
  onDeleteCar: (carId: number) => void;
};

export const MypageCarList = ({
  cars,
  onRequestSetCar,
  onDeleteCar,
}: ListProps) => {
  return (
    <>
      {cars.map(car => (
        <View key={car.carId}>
          <CarComponent
            car={car}
            onRequestSetCar={onRequestSetCar}
            onDeleteCar={onDeleteCar}
          />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  carContainer: {
    width: '100%',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#F2F2FF',
    borderRadius: 10,
    padding: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedBlock: {
    width: '100%',
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 10,
    padding: 23,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF3FF',
  },
  left: {
    flexDirection: 'column',
  },
  touchableArea: {
    flex: 1,
  },
  number: {
    fontSize: 20,
  },
  selectedText: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 5,
  },
});
