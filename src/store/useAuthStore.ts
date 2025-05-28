import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useUserStore } from './useUserStore';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),
  logout: async () => {
    // 1. AsyncStorage에서 토큰 및 유저 정보 삭제
    await AsyncStorage.multiRemove(['jwtToken', 'refreshToken', 'user-storage']); // persist로 자동 저장된 유저 정보 제거

    // 2. 삭제 확인 로그
    const jwt = await AsyncStorage.getItem('jwtToken');
    const refresh = await AsyncStorage.getItem('refreshToken');
    const userStorage = await AsyncStorage.getItem('user-storage');

    console.log('삭제 후 jwtToken:', jwt); // null
    console.log('삭제 후 refreshToken:', refresh); // null
    console.log('삭제 후 user-storage:', userStorage); // null

    // 3. Zustand 상태 초기화
    set({ isLoggedIn: false });
    useUserStore.getState().reset();
  }

}));
