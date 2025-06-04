import React, {useRef, useState} from 'react';
import PagerView from 'react-native-pager-view';
import {RegisterScreen} from '../../screens/Register/RegisterScreen.tsx';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/nav.ts';
import {authService} from '../../services/api/authService.ts';
import {RegisterRequest} from '../../types/user.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../../components/common/CustomModal.tsx';
import {useAuthStore} from '../../store/useAuthStore.ts';
import {dashboardService} from '../../services/api/dashboardService.ts';
import {userService} from '../../services/api/userService.ts';
import {useUserStore} from '../../store/useUserStore.ts';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const RegisterContainer = () => {
  const navigation = useNavigation<Navigation>();

  const [pageIndex, setPageIndex] = useState(0);
  const [nickname, setNickname] = useState('');
  const [drive, setDrive] = useState('');
  const [carNum, setCarNum] = useState('');
  const [interest, setInterest] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

  const pagerRef = useRef<PagerView | null>(null);

  const goToPrior = () => {
    pagerRef.current?.setPage(pageIndex - 1);
    setPageIndex(pageIndex - 1);
  };

  const goToNext = () => {
    pagerRef.current?.setPage(pageIndex + 1);
    setPageIndex(pageIndex + 1);
  };

  const close = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmClose = () => {
    setShowConfirmModal(false);
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  const handleCancelClose = () => {
    setShowConfirmModal(false);
  };

  const goToMain = () => {
    setIsLoggedIn(true);
    setTimeout(() => {
      navigation.reset({index: 0, routes: [{name: 'Main'}]});
    }, 0);
  };

  const handleAlertClose = () => {
    setShowAlertModal(false);
    setAlertMessage('');

    if (isRegisterSuccess) {
      goToMain();
    }
  };

  const handleRegister = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        console.warn('accessToken이 없습니다.');
        return;
      }

      const payload: RegisterRequest = {
        accessToken,
        nickname,
        drivingExperience: Number(drive),
        carNumber: carNum,
        interest,
      };

      const response = await authService.register(payload);

      // 토큰 저장
      await AsyncStorage.setItem('jwtToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);

      // 여기에 user 정보 조회 추가
      const userInfo = await userService.getMyInfo();
      useUserStore.getState().setUser(userInfo);

      // 누적 대시보드 생성
      const res = await dashboardService.registerDashboard();
      console.log('대시보드 등록 성공:', res); // res는 undefined일 수 있음

      setAlertMessage('회원가입이 완료되었습니다.');
      setIsRegisterSuccess(true);
      setShowAlertModal(true);
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      setAlertMessage('회원가입에 실패했습니다.');
      setIsRegisterSuccess(false);
      setShowAlertModal(true);
    }
  };

  return (
    <RegisterScreen
      pageIndex={pageIndex}
      nickname={nickname}
      drive={drive}
      carNum={carNum}
      interest={interest}
      setNickname={setNickname}
      setDrive={setDrive}
      setCarNum={setCarNum}
      setInterest={setInterest}
      goToPrior={goToPrior}
      goToNext={goToNext}
      close={close}
      pagerRef={pagerRef}
      setShowAlertModal={setShowAlertModal}
      setAlertMessage={setAlertMessage}
      register={handleRegister}
      modals={
        <>
          <CustomModal
            visible={showConfirmModal}
            title="가입을 종료하시겠습니까?"
            content={['작성 중인 내용은 저장되지 않았어요.']}
            onClose={handleCancelClose}
            onConfirm={handleConfirmClose}
          />
          <CustomModal
            visible={showAlertModal}
            title={alertMessage}
            isAlert
            onClose={handleAlertClose}
          />
        </>
      }
    />
  );
};

export default RegisterContainer;
