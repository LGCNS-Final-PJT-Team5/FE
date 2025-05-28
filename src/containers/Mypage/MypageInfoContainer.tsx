import {useEffect, useState} from 'react';
import MypageInfoScreen from '../../screens/Mypage/subpage/MypageInfoScreen.tsx';
import {useUserStore} from '../../store/useUserStore.ts';
import {useAuthStore} from '../../store/useAuthStore.ts';
import {userService} from '../../services/api/userService.ts';
import CustomModal from '../../components/common/CustomModal';

export const MypageInfoContainer = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const logout = useAuthStore(state => state.logout);

  const save = async () => {
    try {
      await userService.updateNickname(nickname);
      const updatedUser = await userService.getMyInfo();
      setUser(updatedUser);
      setModalVisible(true);
    } catch (error) {
      console.error('닉네임 저장 실패', error);
    }
  };

  const onWithdraw = async () => {
    try {
      await userService.deleteMyAccount();
      logout();
    } catch (error) {
      console.error('회원 탈퇴 실패', error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setNickname(user.nickname);
      setEmail(user.email ?? '');
    }
  }, [user]);

  return (
    <>
      <MypageInfoScreen
        name={name}
        nickname={nickname}
        setNickname={setNickname}
        email={email}
        save={save}
        onWithdraw={onWithdraw}
      />
      <CustomModal
        visible={modalVisible}
        title="닉네임 변경 완료"
        content={['닉네임이 성공적으로 변경되었어요.']}
        isAlert
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};
