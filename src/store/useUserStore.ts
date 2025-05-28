import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserResponse } from '../types/user';

interface UserStore {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  clearUser: () => void;
  setAlarm: (alarm: boolean) => void;
  reset: () => void;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setAlarm: (alarm) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, alarm } });
        }
      },
      reset: () => set({ user: null }),
      hasHydrated: false,
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: 'user-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // persist가 완료되었을 때
      },
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
