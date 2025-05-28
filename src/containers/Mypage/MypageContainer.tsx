import {useEffect, useState} from 'react';
import MypageScreen from '../../screens/Mypage/MypageScreen.tsx';
import {useUserStore} from '../../store/useUserStore.ts';
import {useAuthStore} from '../../store/useAuthStore.ts';
import {useCarStore} from '../../store/useCarStore.ts';
import {authService} from '../../services/api/authService.ts';

// @ts-ignore
export const MypageContainer = ({navigation}) => {
  const [nickname, setNickname] = useState('');

  const user = useUserStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const activeCar = useCarStore(state => state.activeCar);
  const fetchCars = useCarStore(state => state.fetchCars);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
    }

    // 차량 정보 초기 로딩
    fetchCars();
  }, [user]);

  const handleLogout = async () => {
    try {
      // await authService.logout(); // 일단 프론트에서 데이터 삭제하는 걸로
      logout(); // 상태 초기화
    } catch (e) {
      console.error('로그아웃 실패', e);
    }
  };

  return (
    <MypageScreen
      nickname={nickname}
      car={activeCar?.number || '등록된 차량 없음'}
      navigation={navigation}
      onLogout={handleLogout}
    />
  );
};
