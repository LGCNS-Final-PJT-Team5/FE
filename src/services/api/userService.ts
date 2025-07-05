import api from '../../lib/axios';
import { Car } from '../../types/Mypage';
import { UserResponse } from '../../types/user';

class UserService {
  async getMyInfo(): Promise<UserResponse> {
    const response = await api.get('/user/me');
    return response.data.data;
  }

  // 탈퇴
  async deleteMyAccount(): Promise<void> {
    await api.patch('/user/me/delete');
  }

  async updateNickname(nickname: string): Promise<void> {
    await api.patch('/user/nickname', { nickname });
  }

  async updateAlarm(alarm: boolean): Promise<void> {
    await api.patch(`/user/alarm`, { alarm });
  }

  // 내 차량 조회
  async getMyCars(): Promise<Car[]> {
    const response = await api.get('/user/car');
    return response.data.data.cars;
  }

  // 내 차량 등록
  async registerCar(number: string): Promise<void> {
    await api.post('/user/car', { number });
  }

  // 내 차량 삭제
  async deleteCar(carId: number): Promise<void> {
    await api.delete('/user/car', { data: { carId } });
  }

  // 내 차량 선택
  async activeCar(carId: number): Promise<void> {
    await api.patch('/user/car', { carId });
  }

  // 내 관심사 조회
  async getMyInterest(): Promise<string> {
    const response = await api.get('/user/interest');
    return response.data.data;
  }

  // 내 관심사 변경
  async updateInterest(interest: string): Promise<void> {
    await api.patch('user/interest', { interest });
  }
}

export const userService = new UserService();