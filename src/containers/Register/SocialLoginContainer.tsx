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
      const token = await kakaoLogin(); // 카카오 로그인
      await AsyncStorage.setItem('accessToken', token.accessToken);
      console.log('카카오 로그인 성공:', token);
      const response = await authService.kakaoLogin(token.accessToken);

      if (response.type === 'login') {
        await AsyncStorage.setItem('jwtToken', response.data.accessToken);
        await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

        const userInfo = await userService.getMyInfo();
        useUserStore.getState().setUser(userInfo);

        setIsLoggedIn(true);
      } else if (response.type === 'register') {
        navigation.reset({index: 0, routes: [{name: 'Register'}]});
      }
    } catch (error) {
      console.error('카카오 로그인 실패', error);
    }
  };

  return <SocialLoginScreen onPressLogin={handleLogin} />;
};
