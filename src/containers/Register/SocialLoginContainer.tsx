import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/nav';
import {useUserStore} from '../../store/useUserStore';
import {authService} from '../../services/api/authService';
import {userService} from '../../services/api/userService';
import {login as kakaoLogin} from '@react-native-seoul/kakao-login';
import SocialLoginScreen from '../../screens/Register/SocialLoginScreen';
import {useAuthStore} from '../../store/useAuthStore';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const SocialLoginContainer = () => {
  const navigation = useNavigation<Navigation>();
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

  const handleLogin = async () => {
    try {
      console.log('카카오 로그인 시작');
      const token = await kakaoLogin();
      await AsyncStorage.setItem('accessToken', token.accessToken);
      console.log('카카오 로그인 성공:', token);

      console.log('서버 로그인 요청 시작');
      const response = await authService.kakaoLogin(token.accessToken);
      console.log('서버 로그인 응답:', response);

      if (response.type === 'login') {
        console.log('JWT 토큰 저장 시작');
        await AsyncStorage.setItem('jwtToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        console.log('JWT 토큰 저장 완료');

        console.log('유저 정보 요청 시작');
        const userInfo = await userService.getMyInfo();
        console.log('유저 정보 응답:', userInfo);

        console.log('유저 정보 스토어에 저장 시작');
        useUserStore.getState().setUser(userInfo);
        console.log('유저 정보 스토어에 저장 완료');

        console.log('로그인 상태 변경');
        setIsLoggedIn(true);
        console.log('로그인 플로우 완료');
      } else if (response.type === 'register') {
        console.log('회원가입 화면으로 이동');
        navigation.reset({index: 0, routes: [{name: 'Register'}]});
      }
    } catch (error) {
      console.error('로그인 실패 상세:', error);
      console.error('에러 메시지:', (error as any)?.message);
      console.error('에러 스택:', (error as any)?.stack);
    }
  };

  return <SocialLoginScreen onPressLogin={handleLogin} />;
};
