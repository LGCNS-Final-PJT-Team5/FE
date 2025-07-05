import { create } from 'zustand';
import { Car } from '../types/Mypage';
import { userService } from '../services/api/userService';

export interface CarStore {
  cars: Car[];
  activeCar: Car | null;
  fetchCars: () => Promise<void>;
  // addCar: (car: Car) => void;
  deleteCar: (carId: number) => void;
  setActiveCar: (carId: number) => void;
  clear: () => void;
}

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  activeCar: null,

  fetchCars: async () => {
    const cars = await userService.getMyCars();
    set({
      cars,
      activeCar: cars.find(c => c.active) || null,
    });
  },

  // addCar: (newCar: Car) => {
  //   const updated = [...get().cars, newCar];
  //   set({
  //     cars: updated,
  //     activeCar: newCar.active ? newCar : get().activeCar,
  //   });
  // },

  deleteCar: (carId) => {
    const updated = get().cars.filter(c => c.carId !== carId);
    const activeCar = updated.find(c => c.active) || null;
    set({ cars: updated, activeCar });
  },

  setActiveCar: async (carId: number) => {
    // await userService.setActiveCar(carId); // 서버에 요청
    const updated = get().cars.map(car => ({
      ...car,
      active: car.carId === carId,
    }));
    const activeCar = updated.find(car => car.active) || null;
    set({ cars: updated, activeCar });
  },


  clear: () => set({ cars: [], activeCar: null }),
}));
