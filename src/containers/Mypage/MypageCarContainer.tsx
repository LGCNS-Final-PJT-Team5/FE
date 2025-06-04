import {useEffect, useState} from 'react';
import MypageCarScreen from '../../screens/Mypage/subpage/MypageCarScreen';
import {useCarStore} from '../../store/useCarStore';
import {userService} from '../../services/api/userService';

export const MypageCarContainer = () => {
  const cars = useCarStore(state => state.cars);
  const fetchCars = useCarStore(state => state.fetchCars);
  const setActiveCar = useCarStore(state => state.setActiveCar);
  const deleteCarFromStore = useCarStore(state => state.deleteCar);

  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCarId, setPendingCarId] = useState<number | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const handleRequestSetCar = (carId: number) => {
    setPendingCarId(carId);
    setModalVisible(true);
  };

  const handleConfirmSetCar = async () => {
    if (pendingCarId !== null) {
      await userService.activeCar(pendingCarId);
      setActiveCar(pendingCarId);
    }
    setModalVisible(false);
    setPendingCarId(null);
  };

  const handleAddCar = async (number: string) => {
    try {
      await userService.registerCar(number);
      await fetchCars();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    try {
      await userService.deleteCar(carId);
      deleteCarFromStore(carId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MypageCarScreen
      cars={cars}
      addCar={handleAddCar}
      deleteCar={handleDeleteCar}
      onRequestSetCar={handleRequestSetCar}
      modalVisible={modalVisible}
      onConfirmSetCar={handleConfirmSetCar}
      onCloseModal={() => setModalVisible(false)}
    />
  );
};
