import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useUserStore } from './useUserStore';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  setIsLoggedIn: (val: boolean) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  token: null,
  
  setIsLoggedIn: (val) => set({ isLoggedIn: val }),
  
  setToken: async (token) => {
    // 토큰을 저장소와 상태에 모두 저장
    await AsyncStorage.setItem('jwtToken', token);
    set({ token, isLoggedIn: true });
  },
  
  logout: async () => {
    // 1. AsyncStorage에서 토큰 및 유저 정보 삭제
    await AsyncStorage.multiRemove(['jwtToken', 'refreshToken', 'user-storage']);
    
    // 2. Zustand 상태 초기화
    set({ isLoggedIn: false, token: null });
    useUserStore.getState().reset();
  }
}));
