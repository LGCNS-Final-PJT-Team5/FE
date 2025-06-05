import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import {MypageCarContainer} from '../src/containers/Mypage/MypageCarContainer';
import {useCarStore} from '../src/store/useCarStore';
import {userService} from '../src/services/api/userService';

// Mock MypageCarScreen
jest.mock('../src/screens/Mypage/subpage/MypageCarScreen', () => ({
  __esModule: true,
  default: jest.fn(props => {
    const {Text, TouchableOpacity} = require('react-native');
    return (
      <>
        <Text testID="car-count">{props.cars.length}</Text>
        <TouchableOpacity
          testID="add-car"
          onPress={() => props.addCar('99가9999')}>
          <Text>차량추가</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="delete-car"
          onPress={() => props.deleteCar(1)}>
          <Text>차량삭제</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="request-set-car"
          onPress={() => props.onRequestSetCar(1)}>
          <Text>차량선택</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="confirm-set-car"
          onPress={props.onConfirmSetCar}>
          <Text>차량선택확정</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="close-modal" onPress={props.onCloseModal}>
          <Text>모달닫기</Text>
        </TouchableOpacity>
        <Text testID="modal-visible">{props.modalVisible ? 'Y' : 'N'}</Text>
      </>
    );
  }),
}));

jest.mock('../src/store/useCarStore');
jest.mock('../src/services/api/userService');

const mockFetchCars = jest.fn();
const mockSetActiveCar = jest.fn();
const mockDeleteCarFromStore = jest.fn();

const mockCars = [
  {carId: 1, number: '12가3456', active: true},
  {carId: 2, number: '34나5678', active: false},
];

beforeEach(() => {
  jest.clearAllMocks();
  (useCarStore as unknown as jest.Mock).mockImplementation(selector =>
    selector({
      cars: mockCars,
      fetchCars: mockFetchCars,
      setActiveCar: mockSetActiveCar,
      deleteCar: mockDeleteCarFromStore,
    }),
  );
  (userService.registerCar as jest.Mock).mockResolvedValue(undefined);
  (userService.deleteCar as jest.Mock).mockResolvedValue(undefined);
  (userService.activeCar as jest.Mock).mockResolvedValue(undefined);
});

describe('MypageCarContainer', () => {
  it('초기 렌더링 시 fetchCars가 호출되고 cars prop이 전달된다', async () => {
    render(<MypageCarContainer />);
    expect(mockFetchCars).toHaveBeenCalled();
    const MypageCarScreenMock =
      require('../src/screens/Mypage/subpage/MypageCarScreen').default;
    await waitFor(() => expect(MypageCarScreenMock).toHaveBeenCalled());
    const screenProps =
      MypageCarScreenMock.mock.calls[
        MypageCarScreenMock.mock.calls.length - 1
      ][0];
    expect(screenProps.cars).toEqual(mockCars);
  });

  it('addCar 호출 시 userService.registerCar와 fetchCars가 호출된다', async () => {
    render(<MypageCarContainer />);
    const MypageCarScreenMock =
      require('../src/screens/Mypage/subpage/MypageCarScreen').default;
    await waitFor(() => expect(MypageCarScreenMock).toHaveBeenCalled());
    const screenProps =
      MypageCarScreenMock.mock.calls[
        MypageCarScreenMock.mock.calls.length - 1
      ][0];
    await screenProps.addCar('99가9999');
    expect(userService.registerCar).toHaveBeenCalledWith('99가9999');
    expect(mockFetchCars).toHaveBeenCalled();
  });

  it('deleteCar 호출 시 userService.deleteCar와 deleteCarFromStore가 호출된다', async () => {
    render(<MypageCarContainer />);
    const MypageCarScreenMock =
      require('../src/screens/Mypage/subpage/MypageCarScreen').default;
    await waitFor(() => expect(MypageCarScreenMock).toHaveBeenCalled());
    const screenProps =
      MypageCarScreenMock.mock.calls[
        MypageCarScreenMock.mock.calls.length - 1
      ][0];
    await screenProps.deleteCar(1);
    expect(userService.deleteCar).toHaveBeenCalledWith(1);
    expect(mockDeleteCarFromStore).toHaveBeenCalledWith(1);
  });

  it('차량 선택(onRequestSetCar, onConfirmSetCar) 시 userService.activeCar와 setActiveCar가 호출된다', async () => {
    render(<MypageCarContainer />);
    const MypageCarScreenMock =
      require('../src/screens/Mypage/subpage/MypageCarScreen').default;
    await waitFor(() => expect(MypageCarScreenMock).toHaveBeenCalled());
    let screenProps =
      MypageCarScreenMock.mock.calls[
        MypageCarScreenMock.mock.calls.length - 1
      ][0];

    // 차량 선택 요청 (act로 감싸기)
    await act(async () => {
      screenProps.onRequestSetCar(1);
    });

    // modalVisible이 true가 될 때까지 waitFor
    await waitFor(() => {
      screenProps =
        MypageCarScreenMock.mock.calls[
          MypageCarScreenMock.mock.calls.length - 1
        ][0];
      expect(screenProps.modalVisible).toBe(true);
    });

    // 차량 선택 확정
    await act(async () => {
      await screenProps.onConfirmSetCar();
    });
    expect(userService.activeCar).toHaveBeenCalledWith(1);
    expect(mockSetActiveCar).toHaveBeenCalledWith(1);
  });
});
